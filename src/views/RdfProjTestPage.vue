<template>
  <div>
    <div class="">
        <!-- <PrimeMenu/> -->
    </div>
    <div class="main p-grid p-flex-column">
        <div class="p-col">
            <!-- !!!!!!!!!!! -->
            <Toast/>
            <ConfirmDialog/>
            <!-- !!!!!!!!!!! -->

            <!-- any component from rdf project, for example: -->
            <!--<NamespacesMaintenance />-->
			<MainComponent />
        </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export default {
    name: 'RdfProjTestPage',
    components:{
        Button,
        ConfirmDialog,
        Toast
    },  
    data() {
      return {

      }
    },

}
</script>

<style>

</style>