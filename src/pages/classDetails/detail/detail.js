import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Text
} from '@tarojs/components'
import request from '../../../utils'
import './detail.scss'

export default class Detail extends Component {
  config = {

  }

  constructor () {
    super(...arguments)

    this.state = {
      currentClassify: [],
      currentIndex: 0,
      bookList: []
    }
  }

  componentDidMount () {
    this.getLv2Type()
    this.getDetailBooks()
  }

  getLv2Type = () => {
    let { tag, type } = this.$router.params
    let tempClassify = []
    request({
      url: '/rapi/cats/lv2'
    })
    .then(res => {
      tempClassify = res[type].filter(item => item.major === tag)[0]
      tempClassify.mins.unshift('全部')
      this.setState({
        currentClassify: tempClassify
      })
    })
    .catch(err => {
      throw(err)
    })
  }

  getActiveItem (val, minor) {
    this.setState({
      currentIndex: val
    })
    minor === '全部' ? minor = '' : minor = minor
    this.getDetailBooks(minor)
  }

  getDetailBooks = (minor = '', limit = 20) => {
    let { tag } = this.$router.params
    request({
      url: '/rapi/book/by-categorie',
      data: {
        major: tag,
        minor,
        limit
      }
    })
    .then(res => {
      this.setState({
        bookList: res.books
      })
    })
    .catch(err => {
      throw(err)
    })
  }

  render () {
    const { currentClassify: { mins }, currentIndex, bookList } = this.state
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    return (
      <View className='detail-wrap'>
        <View className='detail-header'>
          <View className='detail-type'>
            {
              mins && mins.map((item, index) => (
                <View
                  key={item}
                  className='detail-text'
                >
                  <Text
                    onClick={this.getActiveItem.bind(this, index, item)}
                    style={index === currentIndex ? 'color: #6190E8;' : ''}
                  >
                    {item}
                  </Text>
                </View>
              ))
            }
          </View>
        </View>
        <View className='detail-container'>
          {
            bookList && bookList.map(item => (
              <View className='detail-book' key={item._id}>
                <View className='detail-cover'>
                  <Image
                    mode='aspectFill'
                    src={`${ImageBaseUrl}${item.cover}`}
                  />
                </View>
                <View className='detail-info'>
                  <Text className='detail-title'>
                    {item.title}
                  </Text>
                  <Text className='detail-author'>
                    {item.author}
                  </Text>
                  <Text className='detail-desc'>
                    {item.shortIntro}
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )
  }
}
