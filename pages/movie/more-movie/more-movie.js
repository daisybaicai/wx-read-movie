// pages/movie/more-movie/more-movie.js
var util = require("../../../utils/util.js")
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationbar: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  onMovieTap: function (event) {
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var catergory = options.catergory;
    this.data.navigationbar = catergory;
    console.log(catergory);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var title = this.data.navigationbar;
    var dataUrl = "";
    switch (title) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  //回调函数
  processDoubanData: function (moviesDouban){
    var movies = [];
    for (var key in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[key];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
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
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });

    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },
  //scroll
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

})