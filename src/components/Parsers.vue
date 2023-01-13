<template>
  <div class="main container p-3">
    <br>
    <div class="parser-section">
      <div  class="parser-quantity-buttons">
        <b-button variant="secondary" size="sm" class="mr-2" @click="addParser">
            + Add parser
        </b-button>
        <b-button variant="secondary" size="sm" class="mr-2" @click="deleteParser">
            - Delete parser
        </b-button>
        <b-button variant="secondary" size="sm" @click="clearParsers">
            x Clear parsers
        </b-button>
      </div>
      <br>
      <div 
        class="parser-options"
        v-for="(parser, parserIndex) in updatedParsers" 
        :key="parserIndex"
      >
        <div class="parser-description">
          <h5><strong>Parser {{ parserIndex + 1 }}:</strong></h5>
          Find the
          <span class="parser-params"> {{'{' + parser.count + getOrdinal(parser.count) + '}'}}</span> 
          <span class="parser-params"> {{'{' + parser.target.unit + '}'}}</span>
          <span class="parser-params"> {{'{' + parser.method + '}'}}</span> 
          the
          <i>{{parserIndex === 0 ? 'beginning of the document' : 'previously parsed value'}}</i>  
          that matches the pattern 
          <span class="parser-params">{{'{' + parser.target.pattern + '}'}}</span> 
        </div>
        <br>
        <div class="parser-options-inputs">
          <b-form-spinbutton 
            class="parser-count" 
            inline
            min="1" 
            max="1000" 
            step="1" 
            v-model="parser.count" 
          >
          </b-form-spinbutton>
          <br>
          <br>
          <div class="parser-target-unit d-inline-flex">
            <b-form-select v-model="parser.target.unit" >
              <b-form-select-option value="phrase">
                phrase
              </b-form-select-option>
              <b-form-select-option value="word">
                word
              </b-form-select-option>
            </b-form-select> 
          </div>
          <br>
          <br>
          <div class="parser-method d-inline-flex">
            <b-form-select v-model="parser.method">
              <b-form-select-option value="after">
                after
              </b-form-select-option>
              <b-form-select-option value="below">
                below
              </b-form-select-option>
            </b-form-select>
          </div>
          <br>
          <br>
          <b-form-group class="parser-target-pattern d-inline-flex">
            <b-form-input 
              placeholder="Enter regular expression" 
              v-model="parser.target.pattern" 
              aria-describedby="parser-target-pattern-live-feedback"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <br>
      </div>
    </div>
    <div class="sample-text" v-if="lineList">
      <h5><strong>Sample document text</strong></h5>
      <br>
      <b-form-group 
        class="border-options"
        label="Bounding box borders" 
        label-class="font-weight-bold" 
        v-slot="{ borderOptions }"
      >
        <b-form-radio 
          v-model="borderedTextUnits" 
          :aria-describedby="borderOptions"
          value="phrases" 
        >
          All phrases
        </b-form-radio>
        <b-form-radio
          v-model="borderedTextUnits" 
          :aria-describedby="borderOptions"
          value="words" 
        >
          All words
        </b-form-radio>
        <b-form-radio
          v-model="borderedTextUnits" 
          :aria-describedby="borderOptions"
          value="target" 
        >
          Target text unit
        </b-form-radio>
      </b-form-group>
      <br>
      <b-button 
        class="target-text-button"
        variant="primary" 
        size="sm" 
        @click="fetchAndHighlightTargetText"
      >
        Get target text unit
      </b-button>
      <br>
      <br>
      <div 
        class="document-text"
        v-for="(pageConfig, pageConfigIndex) in pageConfigs" 
        :key="pageConfigIndex"
      >
        <div class="document-text-page">
          <strong>Page {{pageConfigIndex + 1}}</strong> 
          <v-stage 
            class="konva-stage"
            :config="{ width: pageWidth, height: pageHeight}"
          >
            <v-layer class="phrase-layer" :ref="`phrases-${pageConfigIndex}`">
              <v-group 
                v-for="(phraseConfig, phraseConfigIndex) in pageConfig.phraseConfigs"  
                :key="phraseConfigIndex"
                :config="phraseConfig.groupConfig">
                <v-rect :config="phraseConfig.rectConfig" />
                <v-text :config="phraseConfig.textConfig" />
              </v-group>
            </v-layer>
            <v-layer class="word-layer" :ref="`words-${pageConfigIndex}`">
              <v-group 
                v-for="(wordConfig, wordConfigIndex) in pageConfig.wordConfigs"  
                :key="wordConfigIndex"
                :config="wordConfig.groupConfig">
                <v-tag :config="wordConfig.rectConfig" />
                <v-text :config="wordConfig.textConfig" />
              </v-group>
            </v-layer>
            <v-layer class="phrase-target-layer" :ref="`phraseTarget-${pageConfigIndex}`">
              <v-group 
                v-for="(phraseTargetConfig, phraseTargetConfigIndex) in pageConfig.phraseTargetConfigs"  
                :key="phraseTargetConfigIndex"
                :config="phraseTargetConfig.groupConfig">
                <v-rect :config="phraseTargetConfig.rectConfig" />
                <v-text :config="phraseTargetConfig.textConfig" />
              </v-group>
            </v-layer>
            <v-layer class="word-target-layer" :ref="`wordTarget-${pageConfigIndex}`">
              <v-group 
                v-for="(wordTargetConfig, wordTargetConfigIndex) in pageConfig.wordTargetConfigs"  
                :key="wordTargetConfigIndex"
                :config="wordTargetConfig.groupConfig">
                <v-tag :config="wordTargetConfig.rectConfig" />
                <v-text :config="wordTargetConfig.textConfig" />
              </v-group>
            </v-layer>
          </v-stage>
        </div>
        <br>
      </div>
    </div>
    <br>
  </div>
</template>


<script>
import { getParsersTarget } from 'cloud-vision-lines-phrases-parser'

export default {
  name: 'Parsers',
  props: {
    parsers: Array,
    lineList: Object,
  },
  data() {
    return {
      updatedParsers: this.parsers || 
        [{
          count: 1,
          method: 'after',
          target: {
            unit: 'phrase',
            pattern: '.+',
          }
        }],
      borderedTextUnits: 'target',
      targetTextUnit: null,
      pageConfigs: [],
      pageWidth: 1150,
      pageHeight: 1150,
    }
  },
  methods: {     
    addParser() {
      if (this.updatedParsers.length <= 50) {
        this.updatedParsers.push({
          count: 1,
          method: 'after',
          target: {
            unit: 'phrase',
            pattern: '.+',
          }
        })
      }
    },

    deleteParser() {
      this.updatedParsers.pop()
      if (!this.updatedParsers.length) {
        this.addParser()  
      }
    },

    clearParsers() {
      this.updatedParsers.splice(0) 
      this.addParser()
    },

    getOrdinal(n) {
      let ord = 'th';
      if (n % 10 == 1 && n % 100 != 11) {
        ord = 'st';
      } else if (n % 10 == 2 && n % 100 != 12) {
        ord = 'nd';
      } else if (n % 10 == 3 && n % 100 != 13) {
        ord = 'rd';
      }
      return ord;
    },

    getVertices(normalizedVertices) {
      const vertices = normalizedVertices.map((normalizedVertex) => 
        ({ x: normalizedVertex.x * this.pageWidth, y: normalizedVertex.y * this.pageHeight }));
      return vertices
    },

    getTextUnitConfig(vertices, text, hasBorder) {
      const textUnitConfig = {
        groupConfig : {
          x: vertices[0].x, 
          y: vertices[0].y,
          width:  vertices[1].x - vertices[0].x,
          height: vertices[3].y - vertices[0].y,
        }, 
        rectConfig : {
          width:  vertices[1].x - vertices[0].x,
          height: vertices[3].y - vertices[0].y,
          stroke: 'red', 
          strokeWidth: hasBorder ? 0.5 : 0 
        }, 
        textConfig : {
          text
        }, 
      }
      return textUnitConfig
    },

    setTextUnitConfigs(textUnit, textUnitConfigsType, textUnitTargetConfigsType, pageIndex) {
      const vertices = this.getVertices(textUnit.boundingBox.normalizedVertices)
      const textUnitConfig = this.getTextUnitConfig(vertices, textUnit.text, true)
      const textUnitTargetConfig = this.getTextUnitConfig(vertices, textUnit.text)
      this.pageConfigs[pageIndex][textUnitConfigsType].push(textUnitConfig)
      this.pageConfigs[pageIndex][textUnitTargetConfigsType].push(textUnitTargetConfig)
    },

    setPageConfigs() {
      this.lineList?.pages.forEach((page, pageIndex) => {
        this.pageConfigs.push(
          {
            phraseConfigs: [],
            wordConfigs: [],
            phraseTargetConfigs: [],
            wordTargetConfigs: [],
          }
        )
        page.lines.forEach(line => {
          line.phrases.forEach(phrase => {
            this.setTextUnitConfigs(phrase, 'phraseConfigs', 'phraseTargetConfigs', pageIndex) 
            phrase.words.forEach(word => {
              this.setTextUnitConfigs(word, 'wordConfigs', 'wordTargetConfigs', pageIndex) 
            })
          });
        })
      });
    },

    getTargetTextUnit() {
      const target = getParsersTarget(this.lineList, this.updatedParsers)
      this.targetTextUnit = target
    },

    resetPhraseTargetConfigs() {  
      if (this.targetTextUnit?.unitType === 'phrase') {
        this.pageConfigs.forEach((pageConfig) => {
          pageConfig.phraseConfigs.forEach((phraseConfig) => {
            const { groupConfig, rectConfig, textConfig } = phraseConfig
            const {  width, height, stroke } = rectConfig
            let phraseTargetConfigs = pageConfig.phraseTargetConfigs
            phraseTargetConfigs = []
            phraseTargetConfigs.push({ 
              groupConfig: { ...groupConfig }, 
              rectConfig: { width, height, stroke, strokeWidth: 0 }, 
              textConfig: { ...textConfig }
            })
          })
        })
      }
    },

    addPhraseSegments() {
      if (this.targetTextUnit?.segments) {
        this.pageConfigs.forEach((pageConfig) => {
          const phraseTargetConfigs = pageConfig.phraseTargetConfigs
          phraseTargetConfigs.forEach((phraseTargetConfig, phraseTargetConfigIndex) => {
            const { first: firstSegment, second: secondSegment } = this.targetTextUnit.segments

            if (phraseTargetConfig.groupConfig.x / this.pageWidth === firstSegment.normalizedVertices[0].x && 
                phraseTargetConfig.groupConfig.y / this.pageHeight === firstSegment.normalizedVertices[0].y) {

              const firstSegmentVertices = this.getVertices(firstSegment.normalizedVertices)
              const firstSegmentConfig = this.getTextUnitConfig(firstSegmentVertices, firstSegment.text) 

              const secondSegmentVertices = this.getVertices(secondSegment.normalizedVertices)
              const secondSegmentConfig = this.getTextUnitConfig(secondSegmentVertices, secondSegment.text) 
              
              phraseTargetConfigs.splice(phraseTargetConfigIndex, 1, firstSegmentConfig, secondSegmentConfig)
            }
          })
        })
      }
    },

    displayLayer() {
      let visibleLayer = null
      if (this.borderedTextUnits === 'words' || this.borderedTextUnits === 'phrases') {
        visibleLayer = this.borderedTextUnits
      } else {
        visibleLayer = this.targetTextUnit?.unitType === 'word' ? 'wordTarget' : 'phraseTarget' 
      } 
      const layers = ['words', 'phrases', 'wordTarget', 'phraseTarget']
      const hiddenLayers = layers.filter(layer => layer !== visibleLayer);
      this.pageConfigs.forEach((pageConfig, pageConfigIndex) => {
        this.$refs[`${visibleLayer}-${pageConfigIndex}`][0].getNode().show()  
        hiddenLayers.forEach(hiddenLayer => {
          this.$refs[`${hiddenLayer}-${pageConfigIndex}`][0].getNode().hide()
        });
      })
    },

    addTextUnitBorders() {
      if (this.targetTextUnit) {
        this.pageConfigs.forEach((pageConfig) => {
          const configsNames = ['phraseTargetConfigs', 'wordTargetConfigs'];
          configsNames.forEach(configsName => {
            const configs = pageConfig[configsName]
            configs.forEach(config => {
              if ( 
                (
                  (this.targetTextUnit.unitType === 'word' && configsName === 'wordTargetConfigs') ||
                  (this.targetTextUnit.unitType === 'phrase' && configsName === 'phraseTargetConfigs')
                )
                 &&
                  (this.targetTextUnit.normalizedVertices[0].x * this.pageWidth === config.groupConfig.x) &&
                  (this.targetTextUnit.normalizedVertices[0].y * this.pageHeight === config.groupConfig.y) 
              ) {
                config.rectConfig.strokeWidth = 0.5
              } else {
                config.rectConfig.strokeWidth = 0
              }
            })
          })
        })
      }
    },

    fetchAndHighlightTargetText() {
      this.getTargetTextUnit()
      this.resetPhraseTargetConfigs(); 
      this.addPhraseSegments();  
      this.displayLayer(); 
      this.addTextUnitBorders()
    },
  },
  created() {
    this.setPageConfigs()
  },
  mounted() {
    this.displayLayer()
  },
  watch: { 
    //eslint-disable-next-line no-unused-vars
    borderedTextUnits: function(newData, oldData) {
      this.displayLayer()
    },  
  }
}
</script>


<style scoped>
.konva-stage {
  overflow: auto;
  white-space: nowrap;
  border: 1px solid #555;
}
.parser-params {
  color: blue;
  font-weight: bold;
}
.main {
  background-color: white;
}
</style>