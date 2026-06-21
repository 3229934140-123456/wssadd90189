export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/challenge/index',
    'pages/mistakes/index',
    'pages/stats/index',
    'pages/level-detail/index',
    'pages/result/index',
    'pages/admin/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E40AF',
    navigationBarTitleText: '合规闯关',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F1F5F9'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/challenge/index',
        text: '闯关'
      },
      {
        pagePath: 'pages/mistakes/index',
        text: '错题本'
      },
      {
        pagePath: 'pages/stats/index',
        text: '数据'
      }
    ]
  }
})
