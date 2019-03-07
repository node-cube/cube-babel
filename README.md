cube-babel
========================

babel转换器， 配置的config参数，和babel一致，请参考[babel-core]()的用法

usage: 

```
{
    cube: {
        processors: {
            '.js': [
                [
                    'cube-babel', 
                    {
                        presets: [
                            'react',
                            [
                                'env', 
                                {
                                  "targets": {
                                    "browsers": [
                                        "chrome >= 50", 
                                        "safari >= 7"
                                    ]
                                  }
                                }
                            ]
                        ],
                        plugins: [
                            ['${plugin-name}', {/** ${config} **/}]
                        ]
                    }
                ]
            ]
        }
    }
```

更多配置，请参考babel文档 http://babeljs.io/docs/plugins/#official-presets

