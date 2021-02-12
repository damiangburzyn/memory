<template>
    <div class="hello">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h3>Turn: Player {{ player }}</h3>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="playersCount" class="col col-form-label"
                        >Players count</label
                    >
                </div>
                <div class="col">
                    <input
                        type="number"
                        min="1"
                        class="form-control"
                        id="playersCount"
                        v-model="playersCount"
                    />
                </div>
                <div class="col">
                    <label for="leve" class="col col-form-label">Level</label>
                </div>
                <div class="col">
                    <select v-model="level" id="level" class="form-control">
                        <option
                            v-for="lv in levels"
                            :key="lv.value"
                            v-bind:value="lv"
                        >
                            {{ lv.key }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <br />
        <div class="container cards-grid">
            <div class="row memory-row" v-for="row in cards" :key="row">
                <div class="col p-0" v-for="col in row" :key="col">
                    <div
                        :class="[
                            { flip: col.isFlipped },
                            'memory-col card-container align-items-center justify-content-center'
                        ]"
                        @click="onColClick(col)"
                    >
                        <img
                            class="front-face"
                            draggable="false"
                            :src="require(`@/assets/${col.frontImg}`)"
                            alt="vue"
                        />
                        <img
                            class="back-face"
                            draggable="false"
                            :src="getBackImg(col.backImg)"
                            alt="vue"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Card } from '@/models/models'
import { Guid, Randomizer } from '@/utils/utils'

@Options({
  name: 'HelloWorld',
  props: {
    msg: String
  },

  watch: {
    level: 'onLevelChange'
  }
})
export default class HelloWorld extends Vue {
  msg!: string
  player = 1
  private playersCount = 1
  level: { key: string; value: number } | null = null
  private levels = [
    { key: 'easy 8 pairs', value: 1 },
    { key: 'medium 18 pairs', value: 2 }
  ]

  // table contains image of html card grid
  cards: Card[][] = [];

  cardsToShow: Card[] = []

  Cards = new Array<Card>()
  // Declared as computed property getter
  get rows() {
    let rows = 4
    switch (this.level) {
      case this.levels[0]:
        rows = 4
        break
      case this.levels[1]:
        rows = 6
        break

      default:
        rows = 4
        break
    }
    return rows
  }

  get cols() {
    let cols = 4
    switch (this.level) {
      case this.levels[0]:
        cols = 4
        break
      case this.levels[1]:
        cols = 6
        break
      default:
        cols = 4
        break
    }
    return cols
  }

  getBackImg(pet: string) {
    const images = require.context('../assets/back', false, /\.svg$/)
    return images('./' + pet)
  }

  onLevelChange() {
    // this.cards = new Card[this.rows, this.cols]()
    this.setupCardGrid()
    this.player = 1
  }

  async setupCardGrid() {
    // generate images
    const backImages = new Array<string>()
    for (let i = 1; i < 19; i++) {
      const imgName = `${i}.svg`
      backImages.push(imgName)
    }

    const rows = this.rows
    const cols = this.cols
    const allCardNo = rows * cols
    const uniqCardNo = allCardNo / 2
    const cards = new Array<Card>()
    this.cards = []
    // take pairs of cards to display
    for (let index = 0; index < uniqCardNo; index++) {
      const imgIndex = Randomizer.randomInRange(0, backImages.length)
      const imgPath = backImages[imgIndex]
      const guid = Guid.newGuid()
      const card = new Card({ backImg: imgPath, pairGuid: guid })
      const cardDuplicate = new Card({ backImg: imgPath, pairGuid: guid })
      cards.push(card, cardDuplicate)
      backImages.splice(imgIndex, 1)
    }

    for (let row = 0; row < rows; row++) {
      this.cards[row] = []
      for (let col = 0; col < cols; col++) {
        const cardIdx = Randomizer.randomInRange(0, cards.length)
        const card = cards[cardIdx]
        this.cards[row][col] = card
        cards.splice(cardIdx, 1)
      }
    }
  }

  onColClick(card: Card) {
    if (!card.isFlipped) {
      card.isFlipped = !card.isFlipped
      this.cardsToShow.push(card)
      const length = this.cardsToShow.length
      if (length % 2 === 0) {
        const cardFirst = this.cardsToShow[length - 1]
        const cardSecond = this.cardsToShow[length - 2]
        setTimeout(() => {
          if (this.player < this.playersCount) {
            this.player++
          } else {
            this.player = 1
          }
          if (!(cardSecond.pairGuid === cardFirst.pairGuid)) {
            cardFirst.isFlipped = false
            cardSecond.isFlipped = false
          }
        }, 1300)
      }
    }
  }

  created() {
    this.level = this.levels[0]
    this.setupCardGrid()
  }

  onChildChanged() {
    alert('onChildChanged')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cards-grid {
    max-width: 970px;
}
.memory-row {
    perspective: 1000px;
}
.flip {
    transform: rotateY(180deg);
    transform-style: preserve-3d;
}

.memory-col {
    transition: transform 0.5s;
    border: 2px solid aqua;
    border-radius: 10px;
    padding-left: 1px;
    padding-right: 1px;
    margin: 2px;
    background-color: beige;
    cursor: pointer;
}

.card-container {
    display: flex;
    /* Disable selct on elements */
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}

.front-face,
.back-face {
    width: 100%;
    backface-visibility: hidden;
}

.back-face {
    transform: rotateY(180deg);
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    flex-shrink: 0;
}

h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
