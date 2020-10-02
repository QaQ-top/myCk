;; test.wat
(module
  (import "env" "mem" (memory 2)) ;; 这里指定了从 env.mem 中导入一个memoy内存对象  memoy: 模块initial大小
  (func (export "getEnv") (result i32) (memory.size)) ;; 定义并导出一个叫做“get”的函数，这个函数拥有一个 int32 类型的返回值 返回 值为 memory.size
)

