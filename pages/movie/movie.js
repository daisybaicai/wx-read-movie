// pages/movie/movie.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerShow: true,
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json' 
      },
      success(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      }
    })
  },
  onMoreTap: function (event) {
    var catergory = event.currentTarget.dataset.catergory;
    wx.navigateTo({
      url: 'more-movie/more-movie?catergory=' + catergory,
    })
  },
  onMovieTap: function(event){
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    //对电影部分进行处理
    var movies = [];
    for (var key in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[key];
      var title = subject.title;
      if(title.length > 6) {
        title = title.substring(0,6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      } 
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  }
})