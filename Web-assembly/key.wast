;; name.wast
(module
  (import "key" "fun" (func $js)) ;; ƒ 0()
  (import "key" "protection" (memory 2))
  (func $call_js (call $js)) ;; 可以不 call $js , 直接执行 start $js
  (start $call_js) ;; ƒ 1()
  (func (export "getKey") (result i32) (memory.size)) ;; ƒ 2()
)

