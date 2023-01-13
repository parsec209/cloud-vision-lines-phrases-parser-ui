<template>
  <div>
    <br>
    <br>
    <Parsers :lineList="lineList" />
    <br>
  </div>
</template>


<script>
import Parsers from './components/Parsers'
import { annotations } from './util/PDF_searchable_annotations' 
//import { annotations } from './util/GIF_annotations' 

export default {
  name: 'App',
  components: {
    Parsers
  },
  data() {
    return {
      lineList: annotations.lineList,
    }
  },
}
</script>

