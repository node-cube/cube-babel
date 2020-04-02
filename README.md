cube-babel
========================

babel转换器， 配置的config参数，和babel一致，请参考[babel-core]()的用法


### case 配置普通转换

注意工程中需要安装: @babel/preset-env
```
{
  "cube": {
    "processors": {
      ".js": [
        "cube-babel",
        {
          "presets": [
             ["env", {"targets": {"browsers": ["chrome >= 50", "safari >= 7"]}}]
          ]
        }
      ]
    }
  }
}
```

### case 配置react转换

注意工程中需要安装: @babel/preset-env  @babel/preset-react 
```
{
  "cube": {
    "processors": {
      ".js": [
        "cube-babel",
        {
          "presets": [
            "react",
            ["env", {"targets": {"browsers": ["chrome >= 50", "safari >= 7"]}}]
          ]
        }
      ]
    }
  }
}
```

### 详细配置
usage: 

```
{
  cube: {
    processors: {
      '.js': [
        [
          'cube-babel', 
          {
            presets: [],
            plugins: [
              ['${plugin-name}', {/** ${config} **/}]
            ]
          }
        ]
      ]
    }
  }
}
```

更多配置，请参考babel文档 https://babeljs.io/docs/en/presets

