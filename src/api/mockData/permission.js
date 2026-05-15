import Mock from 'mockjs'
export default {
  getMenu: config => {
    let username = ''
    let password = ''
    if (config && config.body) {
      try {
        const body = JSON.parse(config.body)
        username = body.username || ''
        password = body.password || ''
      } catch (e) {
        console.warn('解析登录参数失败:', e)
      }
    }
    // 先判断用户是否存在
    // 判断账号和密码是否对应
    //menuList用于后面做权限分配，也就是用户可以展示的菜单
    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/mall',
              name: 'mall',
              label: '商品管理',
              icon: 'video-play',
              url: 'Mall'
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User'
            },
            {
              path: '/todo',
              name: 'todo',
              label: '待办事项',
              icon: 'List',
              url: 'Todo'
            },
            {
              path: '/report',
              name: 'report',
              label: '数据报表',
              icon: 'TrendCharts',
              url: 'Report'
            },
            {
              path: '/upload',
              name: 'upload',
              label: '文件管理',
              icon: 'UploadFilled',
              url: 'Upload'
            },
            {
              path: '/message',
              name: 'message',
              label: '消息通知',
              icon: 'Bell',
              url: 'Message'
            },
            {
              path: '/settings',
              name: 'settings',
              label: '系统设置',
              icon: 'Setting',
              url: 'Settings'
            },
            {
              path: '/other',
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: '/page1',
                  name: 'page1',
                  label: '页面1',
                  icon: 'setting',
                  url: 'Page1'
                },
                {
                  path: '/page2',
                  name: 'page2',
                  label: '页面2',
                  icon: 'setting',
                  url: 'Page2'
                }
              ]
            }
          ],
          token: Mock.Random.guid(),
          message: '获取成功'
        }
      }
    } else if (username === 'xiaoxiao' && password === 'xiaoxiao') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User'
            },
            {
              path: '/todo',
              name: 'todo',
              label: '待办事项',
              icon: 'List',
              url: 'Todo'
            },
            {
              path: '/message',
              name: 'message',
              label: '消息通知',
              icon: 'Bell',
              url: 'Message'
            },
            {
              path: '/settings',
              name: 'settings',
              label: '系统设置',
              icon: 'Setting',
              url: 'Settings'
            }
          ],
          token: Mock.Random.guid(),
          message: '获取成功'
        }
      }
    } else {
        
      return {
        code: -999,
        data: {
          message: '密码错误'
        }
      }
        
    }

  }
}