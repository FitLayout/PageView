<template>
  <Toast />

  <div class="p-col text_left">
    <h2>SPARQL Query</h2>
  </div>
  <table class="common_bgc editor_table">
    <tr class="minimal">
      <th class="text_left padding_set" v-if="htmlCode.length">
        Namespaces:
      </th>
    </tr>  
    <tr v-for="(n,j) in htmlCode" :key="j" class="minimal">
      <!-- tds representing namespaces with prefixes -->
      <td class="text_left width_95 padding_set font_style" :id="`td-${j}`"></td>
    </tr>

    <tr>
      <td class="width_95">
        <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
      </td>
      <td>
        <tr v-for="i in newRowsCount" :key="i" :id="i-oldRowsCount+1" class="hidden_tr">
          <td v-tooltip.right="errorText" class="">
            <i class="pi pi-times-circle red_text"></i>
          </td>
        </tr>
      </td>
    </tr>
  </table>
  <div class="p-grid under_editor_space">
    <div class="p-col-4 p-offset-4">
      <Button @click="queryData" label="Execute" class="p-button-sm" 
      v-tooltip.bottom="'Execute the query'"/>

    </div>
    <div class="p-col-4">
      <InputText id="name" v-model="queryName" type="text" class="p-inputtext-sm" placeholder="Save query as ..."/>
      <Button label="Save" @click="saveQueryToLocalStorage" class="p-button-sm p-button-secondary save_button_margin"
        v-tooltip.bottom="'Save new or edited query'"/>
    </div>
  </div>
</template>

<script>
  // import Prism Editor
  import { PrismEditor } from 'vue-prism-editor';
  // import the styles for vue-prism-editor 
  import 'vue-prism-editor/dist/prismeditor.min.css';
  
  // import highlighting library (you can use any library you want just return html string)
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  // turtle was needed as dependency
  import 'prismjs/components/prism-turtle'; 
  import 'prismjs/components/prism-sparql'; 

  // theme for the editor
  // import syntax highlighting styles
  import 'prismjs/themes/prism.css';

  // PrimeVue components
  import Button from 'primevue/button';
  import Tooltip from 'primevue/tooltip';
  import Toast from 'primevue/toast';
  import Textarea from 'primevue/textarea';
  import InputText from 'primevue/inputtext';

  // Sparql parser to validate query
  import Sparqljs from 'sparqljs';

  export default {
    name: 'RdfEditor',
    components: {
      PrismEditor,
      Button,
      Toast,
      Textarea,
      InputText
    },
	inject: ['apiClient'],
    emits: ['resultReturn','loadingResult'],
    directives: {
      'tooltip': Tooltip
    },
    data: () => ({ 
      // syntax highlighted html code representing prefixes in editor 
      htmlCode:[],
      // query entered by user
      code: "",
      // if the syntax is valid
      valid: false,
      // array containing all prefix and namespace tuples
      prefixNsTuples: [],
      // number of rows in the query
      newRowsCount: 0,
      // number of rows in query before its change
      oldRowsCount: 1,
      // text of the error found during syntax check
      errorText: ' ',
      // parser used for query validation
      parser: new Sparqljs.Parser(),
      // already added prefixes
      alreadyAddedPrefs:[],
      // prefix declarations to prepend to the query
      prefixTextDeclarations: [],
      // type of the query (select, ask, construct, update-insert,delete,...)
      queryType: "select",
      // name of the query to be saved
      queryName: "",
      // local storage array for storing queries
      storedQueries: []
    }),
    mounted() {
      // initial query off all namespaces from the repository
      this.queryAllNamespaces();

      // checking if array for queries exists in the local storage
      if(localStorage.getItem('storedQueries')) {
        // get the content
        this.storedQueries = JSON.parse(localStorage.getItem('storedQueries'));
      } else {
        // create the needed array 
        const parsed = JSON.stringify(this.storedQueries);
        localStorage.setItem('storedQueries', parsed);
      }

      // redirect from "SavedQueriesPage"
      if(this.$route.params.do != "" && this.$route.params.name ){
          this.queryName = this.$route.params.name;
          this.$router.replace({params: { name: undefined, do: undefined}}); 
          // show the body of the chosen query in the editor
          this.code = this.storedQueries.filter(i => i.name == this.queryName)[0].body;  
      }

    },
    methods: {
      // creating syntax highlighted version of the query
      highlighter(code) {
        // user written query in editor changed
        if(this.newRowsCount != 0) {
          // delete not needed rows used for showing the error 
          this.deleteDivs();
          // set the new row counts
          this.oldRowsCount = this.newRowsCount+1; // old 6 new 5
        } 

        // creation of prefix declarations 
        this.searchPrefixesToComplete(code);

        // visualize prefix declarations in the editor by setting the HTML content
        this.setPrefixDeclarationsTdInnerHtml();
        
        // count the user written text rows
        code.split("\n").forEach(_ => {
          this.newRowsCount++;
        })

        // 
        // languages.<insert language> to return html with markup 
        let highlightedCode = highlight(code, languages.sparql); 

        return highlightedCode;
      },

      // fetching all namespaces present in the repository
      async queryAllNamespaces(){
        const data = await fetch(this.apiClient.repositoryEndpoint() + '/namespaces', {
            method: 'GET',
            headers: {
              'Accept':'application/json',
            },
          })
          .then(res =>  {
            if(!res.ok){
              this.$toast.add({severity:'error', summary: 'Error', detail:"Error happened during fetch of all namespaces!"});
            } else { return res.json(); }
          })
          .catch((error) => console.log(error))

        // storing namespaces with corresponding prefixes as tuples
        for (let index = 0; index < data.results.bindings.length; index++) {
          this.prefixNsTuples.push({
            'prefix': data.results.bindings[index].prefix.value,
            'namespace': data.results.bindings[index].namespace.value
          })
        }
      },
      
      // executing user given query
      async queryData(){

        // connect prefixes with query body
		let queryText = this.code;
		//console.log('code ' + this.code);

        this.prefixTextDeclarations.forEach(element => {
		  queryText = element.code + queryText;
		  //console.log('add ' + element.code);
        });

        // syntax validation
        this.validateQuery(queryText, this.parser);

        // get the type of query
        if(queryText.toLowerCase().includes("construct")){
          this.queryType = "construct";
        } else if(queryText.toLowerCase().includes("ask")){
          this.queryType = "ask";
        } else if(queryText.toLowerCase().includes("select")){
          this.queryType = "select";
        } else if(queryText.toLowerCase().includes("update")){
          this.queryType = "update";
        } else {
          this.queryType = "empty";
          this.$toast.add({severity:'error', summary: 'Error', detail:'Query was empty!', life: 3000});
        }


        let answerToQuery;
        if(this.valid && this.queryType !== "empty"){
          // emit that the fetching of data started, so show spinner
          this.$emit('loadingResult', true);
          let sendQueryToUrl = this.apiClient.repositoryRoot();
          // change the URL end based on the type of query
          if(this.queryType == "update"){
            sendQueryToUrl = sendQueryToUrl + '/repository/updateQuery';
          } else {
            sendQueryToUrl = sendQueryToUrl + '/repository/query';
          }

          answerToQuery = await fetch(sendQueryToUrl, {
            method: 'POST',
            headers: {
              'Content-Type':'application/sparql-query'
            },
            body: queryText,

          })
          .then(res =>
              this.errorHandler(res),
          )
          .catch(error => 
            this.$toast.add({severity:'error', summary: 'Error', detail:error}),
          )
          this.valid = !this.valid;

          // emit that the fetching of data ended, so hide spinner
          this.$emit('loadingResult', false);

          // emit answer if everything was OK and data was found
          if((this.queryType == "ask" && 'boolean' in answerToQuery) || 
            (this.queryType == "select" && answerToQuery.results.bindings.length > 0) ||
            (this.queryType == "construct" &&  answerToQuery.length > 0) ||
            (this.queryType == "update" && 'status' in answerToQuery)) 
          {
            let data = [answerToQuery, this.prefixNsTuples, this.queryType];
            this.$emit('resultReturn', {data});
          } else {
            // no data found for the query
            let data = ['', '', 'clear'];
            this.$emit('resultReturn', {data});
            this.$toast.add({severity:'warn', summary: 'Warn Message', detail:'Query was successful but no data found!', life: 5000});
          }
        }

      },

      // validation of the query typed in by the user 
      validateQuery(code,parser){
        try {
          // syntax validation by parser
          let parsed = parser.parse(code);
          this.valid = true;
          this.errorText = ' ';
        } catch (error) {
          // parsing the number of the line on which the error is
          // from the error.message 
          this.errorText = error.message;
          const nthIndxOfSpace = this.nthIndex(this.errorText,' ',4) + 1;
          const indxOfColon = this.errorText.indexOf(':');
          const rowNumWithError = this.errorText.substring(nthIndxOfSpace,indxOfColon); 

          // handling if in the error.message the line number is not specified
          if(!isNaN(rowNumWithError)){
            // line number is present
            document.getElementById(rowNumWithError).style.visibility = "visible";
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Query contains error!', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Query contains error: '+this.errorText});
          }
        }
      },

      // function to remove error icon placeholder divs from document 
      deleteDivs(){
        for (let index = 1; index <= this.newRowsCount-this.oldRowsCount+1; index++) {
          document.getElementById(index).remove();  
        }
      },

      // searching for the nth occurrence of pattern in string
      // returns index of the occurrence
      nthIndex(str, pat, n){
          var L= str.length, i= -1;
          while(n-- && i++<L){
              i= str.indexOf(pat, i);
              if (i < 0) break;
          }
          return i;
      },

      // controlling if server response contains error
      async errorHandler(res){
        if(!res.ok){
          // something went wrong on server (status like: 4xx or 5xx, ...)
          this.$toast.add({severity:'error', summary: 'Error', detail:"Error happened during execution!", life: 3000});
        } else {

          this.$toast.add({severity:'success', summary: 'Success Message', detail:'Query was successfully executed!', life: 3000});
          if(this.queryType != "construct"){
            return await res.json();
          } else {
            return await res.text();
          }
          
        }
      },

      // automatic completion of prefixes
      searchPrefixesToComplete(code){
        let newlyFoundPrefs = [];
        if(code.length > 0 && code.match(/([a-z][A-Z][0-9])*\w+/g)){
          // search for possible prefixes in the user given query
          const matched = code.match(/([a-z][A-Z])*\w*:([a-z][A-Z][0-9])*\w+/g); 
          if(matched){
            // control if the matched words are correct prefixes
            matched.forEach(element => {
              const prefix = element.substring(0,element.indexOf(":"));
              const nameSpacePrefixTuple = this.prefixNsTuples.filter(i => i.prefix == prefix)[0];

              // prepare proper html code to visualize prefix in the editor for the user
              if(nameSpacePrefixTuple && !newlyFoundPrefs.includes(prefix)){
                // this.alreadyAddedPrefs.push(prefix);
                newlyFoundPrefs.push(prefix);
                if(!this.alreadyAddedPrefs.includes(prefix)){
                  // store text representation of prefix (declaration)
                  this.prefixTextDeclarations.push({
                    "prefix":prefix,
                    "code":"PREFIX " + prefix +": <" +nameSpacePrefixTuple.namespace+ ">"
                  })
                  // highlight the html code
                  let highlightedCode = highlight("PREFIX " + prefix +": <" +nameSpacePrefixTuple.namespace
                    + ">", languages.sparql);
                  this.htmlCode.push({
                    "prefix":prefix,
                    "code":highlightedCode});
                  }
              }

            })

            // control which previous prefixes are not present in the query
            this.alreadyAddedPrefs.forEach(e => {
              if(!newlyFoundPrefs.includes(e)) {
                this.htmlCode = this.htmlCode.filter(i => i.prefix !== e);
                this.prefixTextDeclarations = this.prefixTextDeclarations.filter(i => i.prefix !== e);              
              } 
            });

            // save all present prefixes
            this.alreadyAddedPrefs = newlyFoundPrefs;
          } else { 
            // clear html code after user deleting all prefixes from editor
            this.htmlCode = [];
            this.alreadyAddedPrefs = [];  
          }
        } else {
          // no prefix found in the query
          this.alreadyAddedPrefs = [];
          this.htmlCode = [];
          this.prefixTextDeclarations = []; 
        }
      },

      setPrefixDeclarationsTdInnerHtml(){
        // wait until DOM is re-rendered
        this.$nextTick(()=>{
          if(this.htmlCode.length>0){
            // set the inner HTML of the td = show the namespace with prefix to the user
            this.htmlCode.forEach((e,i) => {
              document.getElementById('td-'+(i)).innerHTML = e.code;
            });
          }
        })
      },

      // save user specified query to local storage
      saveQueryToLocalStorage(){

        if(this.queryName.length > 0 && this.code.length > 0){
          const findIdx = this.storedQueries.findIndex(item => item.name == this.queryName);
          if(findIdx >= 0){
            // the query is already stored -> update body
            this.storedQueries[findIdx].body = this.code;              
          } else {
            // new query to store
            const query = {name: this.queryName, body: this.code};
            this.storedQueries.push(query);
          } 

          const parsed = JSON.stringify(this.storedQueries);
          localStorage.setItem('storedQueries', parsed);

          this.$toast.add({severity:'success', summary: 'Success Message', detail:`Query "${this.queryName}" was successfully saved!`, life: 3000});
        } else {
          if(this.queryName.length == 0){
            // no name for the query was given
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Pleas specify name for the query!', life: 5000});
          }

          if(this.code.length == 0){
            // no name for the query was given
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Pleas specify the query!', life: 5000});
          }

        }
      },
    },
  };
</script>

<style>
  /* required class for vue-prism-editor*/
  .my-editor{
    background: #f5f2f0;
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .common_bgc{
    background: #f5f2f0;
  }
  
  .error_td_size{
    font-size: 14px;
    padding: 5px;
    line-height: 1.5;
    height: 100%;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus{
    outline: none;
  }

  .text_left{
    text-align: left;
  }

  .width_95{
    width: 95%;
    position: relative;
  }

  .padding_set{
    padding: 0 25px;
    padding-top: 5px;
  }

  .font_style{
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  .editor_table{
    width:100%; 
    border: 2px solid black; 
    min-height:20vh;
  }

  .hidden_tr{
    visibility: hidden;
  }

  .red_text{
    color:red;
  }

  .under_editor_space{
    text-align:center;
    margin-top:5px !important;
  }

  .save_button_margin{
    margin-right: 10px;
  }

  .editor_table tr.minimal {
	  height: 0;
  }
</style>
