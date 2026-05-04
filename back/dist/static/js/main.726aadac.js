/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3704
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ./node_modules/@expo/metro-runtime/src/index.ts + 5 modules
var src = __webpack_require__(816);
// EXTERNAL MODULE: ./node_modules/expo/src/launch/registerRootComponent.tsx + 5 modules
var registerRootComponent = __webpack_require__(2299);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6665);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 6 modules
var StyleSheet = __webpack_require__(3668);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(3929);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Text/index.js
var Text = __webpack_require__(6283);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TextInput/index.js
var TextInput = __webpack_require__(6773);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TouchableOpacity/index.js + 2 modules
var TouchableOpacity = __webpack_require__(9685);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/FlatList/index.js + 3 modules
var FlatList = __webpack_require__(932);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 52 modules
var Animated = __webpack_require__(8198);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Dimensions/index.js
var Dimensions = __webpack_require__(6725);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(397);
;// ./App.tsx
const{width:SCREEN_W,height:SCREEN_H}=Dimensions["default"].get('window');const SNAP_THRESHOLD=0.4;const VELOCITY_THRESHOLD=0.5;const COLORS={bg:'#000000',surface:'#111111',surface2:'#1a1a1a',primary:'#6366f1',primaryLight:'#818cf8',text:'#ffffff',textSecondary:'#9ca3af',border:'#27272a',inputBg:'#1a1a1a'};const CHATS=[{id:'1',title:'General',lastMessage:'Hello everyone!',time:'10:30'},{id:'2',title:'Random',lastMessage:'Check this out',time:'09:15'},{id:'3',title:'Support',lastMessage:'Thanks for help',time:'Yesterday'}];const MESSAGES=[{id:'1',text:'Hey there!',sender:'other',time:'10:30'},{id:'2',text:'Hi! How are you?',sender:'me',time:'10:31'},{id:'3',text:'Doing great, thanks!',sender:'other',time:'10:32'}];function useKeyboardHeight(){const[keyboardHeight,setKeyboardHeight]=(0,react.useState)(0);(0,react.useEffect)(()=>{if(false)// removed by dead control flow
{}const updateHeight=()=>{const vv=window.visualViewport;if(!vv)return;const h=window.innerHeight-vv.height;setKeyboardHeight(h>0?h:0);};window.visualViewport?.addEventListener('resize',updateHeight);window.visualViewport?.addEventListener('scroll',updateHeight);updateHeight();return()=>{window.visualViewport?.removeEventListener('resize',updateHeight);window.visualViewport?.removeEventListener('scroll',updateHeight);};},[]);return keyboardHeight;}function ChatsScreen({onSelectChat}){return (0,jsx_runtime.jsxs)(View["default"],{style:styles.screen,children:[(0,jsx_runtime.jsx)(View["default"],{style:styles.chatsHeader,children:(0,jsx_runtime.jsx)(Text["default"],{style:styles.chatsTitle,children:"Chats"})}),(0,jsx_runtime.jsx)(FlatList["default"],{data:CHATS,keyExtractor:item=>item.id,renderItem:({item})=>(0,jsx_runtime.jsxs)(TouchableOpacity["default"],{style:styles.chatItem,onPress:()=>onSelectChat(item),children:[(0,jsx_runtime.jsx)(View["default"],{style:styles.chatAvatar,children:(0,jsx_runtime.jsx)(Text["default"],{style:styles.chatAvatarText,children:item.title[0]})}),(0,jsx_runtime.jsxs)(View["default"],{style:styles.chatInfo,children:[(0,jsx_runtime.jsx)(Text["default"],{style:styles.chatTitle,children:item.title}),(0,jsx_runtime.jsx)(Text["default"],{style:styles.chatLastMessage,numberOfLines:1,children:item.lastMessage})]}),(0,jsx_runtime.jsx)(Text["default"],{style:styles.chatTime,children:item.time})]})})]});}function ChatScreen({chat,onBack,keyboardHeight,inputRef}){const[messages,setMessages]=(0,react.useState)(MESSAGES);const[inputText,setInputText]=(0,react.useState)('');const scrollRef=(0,react.useRef)(null);const containerRef=(0,react.useRef)(null);(0,react.useEffect)(()=>{if(true){const interval=setInterval(()=>{const textarea=document.querySelector('textarea[placeholder="Message..."]');if(textarea){const container=textarea.parentElement;if(container){container.style.setProperty('position','fixed','important');container.style.setProperty('bottom','0px','important');container.style.setProperty('left','0px','important');container.style.setProperty('right','0px','important');container.style.setProperty('z-index','9999','important');clearInterval(interval);}}},100);const timeout=setTimeout(()=>clearInterval(interval),5000);return()=>{clearInterval(interval);clearTimeout(timeout);};}},[]);const sendMessage=()=>{if(!inputText.trim())return;const newMsg={id:Date.now().toString(),text:inputText.trim(),sender:'me',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})};setMessages(prev=>[...prev,newMsg]);setInputText('');setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100);};const renderMessage=({item})=>(0,jsx_runtime.jsxs)(View["default"],{style:[styles.messageBubble,item.sender==='me'?styles.myMessage:styles.otherMessage],children:[(0,jsx_runtime.jsx)(Text["default"],{style:styles.messageText,children:item.text}),(0,jsx_runtime.jsx)(Text["default"],{style:styles.messageTime,children:item.time})]});return (0,jsx_runtime.jsxs)(View["default"],{style:styles.screen,children:[(0,jsx_runtime.jsx)(View["default"],{style:styles.messagesContainer,children:(0,jsx_runtime.jsx)(FlatList["default"],{ref:scrollRef,data:messages,keyExtractor:item=>item.id,renderItem:renderMessage,contentContainerStyle:styles.messagesList,onContentSizeChange:()=>scrollRef.current?.scrollToEnd({animated:false})})}),(0,jsx_runtime.jsxs)(View["default"],{ref:containerRef,style:styles.inputContainer,children:[(0,jsx_runtime.jsx)(TextInput["default"],{ref:inputRef,style:styles.input,value:inputText,onChangeText:setInputText,placeholder:"Message...",placeholderTextColor:COLORS.textSecondary,multiline:true,maxHeight:100}),(0,jsx_runtime.jsx)(TouchableOpacity["default"],{style:styles.sendButton,onPress:sendMessage,children:(0,jsx_runtime.jsx)(Text["default"],{style:styles.sendIcon,children:"\u27A4"})})]})]});}function App(){const[currentScreen,setCurrentScreen]=(0,react.useState)('chats');const[currentChat,setCurrentChat]=(0,react.useState)(null);const keyboardHeight=useKeyboardHeight();const chatsX=(0,react.useRef)(new Animated["default"].Value(0)).current;const chatX=(0,react.useRef)(new Animated["default"].Value(SCREEN_W)).current;const isAnimating=(0,react.useRef)(false);const isDragging=(0,react.useRef)(false);const dragStartX=(0,react.useRef)(0);const dragCurrentX=(0,react.useRef)(0);const rafId=(0,react.useRef)(null);const openChat=chat=>{if(isAnimating.current)return;isAnimating.current=true;setCurrentChat(chat);setCurrentScreen('chat');chatsX.setValue(0);chatX.setValue(SCREEN_W);Animated["default"].parallel([Animated["default"].timing(chatsX,{toValue:-SCREEN_W*0.3,duration:200,useNativeDriver:true}),Animated["default"].timing(chatX,{toValue:0,duration:200,useNativeDriver:true})]).start(()=>{isAnimating.current=false;});};const closeChat=()=>{if(isAnimating.current)return;isAnimating.current=true;Animated["default"].parallel([Animated["default"].timing(chatsX,{toValue:0,duration:200,useNativeDriver:true}),Animated["default"].timing(chatX,{toValue:SCREEN_W,duration:200,useNativeDriver:true})]).start(()=>{setCurrentScreen('chats');setCurrentChat(null);isAnimating.current=false;});};const onTouchStart=(0,react.useCallback)(e=>{if(currentScreen!=='chat'||isAnimating.current)return;const touch=e.touches[0];dragStartX.current=touch.clientX;dragCurrentX.current=touch.clientX;isDragging.current=true;},[currentScreen]);const onTouchMove=(0,react.useCallback)(e=>{if(!isDragging.current)return;const touch=e.touches[0];const dx=touch.clientX-dragStartX.current;const dy=touch.clientY-dragStartY.current;if(Math.abs(dx)>Math.abs(dy)){e.preventDefault();}dragCurrentX.current=touch.clientX;const progress=Math.max(0,dx);const chatsTarget=-SCREEN_W*0.3+progress*0.3;const chatTarget=progress;if(rafId.current)cancelAnimationFrame(rafId.current);rafId.current=requestAnimationFrame(()=>{chatsX.setValue(chatsTarget);chatX.setValue(chatTarget);});},[]);const onTouchEnd=(0,react.useCallback)(e=>{if(!isDragging.current)return;isDragging.current=false;if(rafId.current)cancelAnimationFrame(rafId.current);const dx=dragCurrentX.current-dragStartX.current;const dt=Date.now()-dragStartTime.current;const vx=dx/dt;const progress=dx/SCREEN_W;if(progress>SNAP_THRESHOLD||vx>VELOCITY_THRESHOLD){closeChat();}else{Animated["default"].parallel([Animated["default"].timing(chatsX,{toValue:-SCREEN_W*0.3,duration:200,useNativeDriver:true}),Animated["default"].timing(chatX,{toValue:0,duration:200,useNativeDriver:true})]).start();}},[closeChat]);const dragStartY=(0,react.useRef)(0);const dragStartTime=(0,react.useRef)(0);const onTouchStartFull=(0,react.useCallback)(e=>{if(currentScreen!=='chat'||isAnimating.current)return;const touch=e.touches[0];dragStartX.current=touch.clientX;dragStartY.current=touch.clientY;dragStartTime.current=Date.now();dragCurrentX.current=touch.clientX;isDragging.current=true;},[currentScreen]);const onTouchMoveFull=(0,react.useCallback)(e=>{if(!isDragging.current)return;const touch=e.touches[0];const dx=touch.clientX-dragStartX.current;const dy=touch.clientY-dragStartY.current;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>5){e.preventDefault();}else if(Math.abs(dy)>=Math.abs(dx)){isDragging.current=false;return;}dragCurrentX.current=touch.clientX;const progress=Math.max(0,dx);const chatsTarget=-SCREEN_W*0.3+progress*0.3;const chatTarget=progress;if(rafId.current)cancelAnimationFrame(rafId.current);rafId.current=requestAnimationFrame(()=>{chatsX.setValue(chatsTarget);chatX.setValue(chatTarget);});},[]);const onTouchEndFull=(0,react.useCallback)(e=>{if(!isDragging.current)return;isDragging.current=false;if(rafId.current)cancelAnimationFrame(rafId.current);const dx=dragCurrentX.current-dragStartX.current;const dt=Date.now()-dragStartTime.current;const vx=dx/dt;const progress=dx/SCREEN_W;if(progress>SNAP_THRESHOLD||vx>VELOCITY_THRESHOLD){closeChat();}else{Animated["default"].parallel([Animated["default"].timing(chatsX,{toValue:-SCREEN_W*0.3,duration:200,useNativeDriver:true}),Animated["default"].timing(chatX,{toValue:0,duration:200,useNativeDriver:true})]).start();}},[closeChat]);return (0,jsx_runtime.jsxs)(View["default"],{style:styles.container,children:[(0,jsx_runtime.jsx)(Animated["default"].View,{style:[styles.screenLayer,{transform:[{translateX:chatsX}],opacity:currentScreen==='chats'?1:0.7,zIndex:1}],children:(0,jsx_runtime.jsx)(ChatsScreen,{onSelectChat:openChat})}),currentChat&&(0,jsx_runtime.jsx)(Animated["default"].View,Object.assign({style:[styles.screenLayer,{transform:[{translateX:chatX}],zIndex:2}]}, true?{onTouchStart:onTouchStartFull,onTouchMove:onTouchMoveFull,onTouchEnd:onTouchEndFull}:0,{children:(0,jsx_runtime.jsx)(ChatScreen,{chat:currentChat,onBack:closeChat,keyboardHeight:keyboardHeight})}))]});}const styles=StyleSheet["default"].create({container:{flex:1,backgroundColor:COLORS.bg},screenLayer:Object.assign({position:'absolute',top:0,left:0,right:0,bottom:0}, true?{touchAction:'pan-y'}:0),screen:{flex:1,backgroundColor:COLORS.bg,position:'relative'},chatsHeader:{paddingTop: false?0:20,paddingHorizontal:16,paddingBottom:16,borderBottomWidth:1,borderBottomColor:COLORS.border},chatsTitle:{color:COLORS.text,fontSize:28,fontWeight:'700'},chatItem:{flexDirection:'row',alignItems:'center',padding:12,borderBottomWidth:1,borderBottomColor:COLORS.border},chatAvatar:{width:48,height:48,borderRadius:24,backgroundColor:COLORS.primary,justifyContent:'center',alignItems:'center',marginRight:12},chatAvatarText:{color:COLORS.text,fontSize:18,fontWeight:'600'},chatInfo:{flex:1},chatTitle:{color:COLORS.text,fontSize:16,fontWeight:'600'},chatLastMessage:{color:COLORS.textSecondary,fontSize:14,marginTop:2},chatTime:{color:COLORS.textSecondary,fontSize:12},messagesList:{padding:16,flexGrow:1},messageBubble:{maxWidth:'80%',padding:12,borderRadius:16,marginBottom:8},myMessage:{alignSelf:'flex-end',backgroundColor:COLORS.primary,borderBottomRightRadius:4},otherMessage:{alignSelf:'flex-start',backgroundColor:COLORS.surface2,borderBottomLeftRadius:4},messageText:{color:COLORS.text,fontSize:15,lineHeight:20},messageTime:{color:COLORS.textSecondary,fontSize:11,marginTop:4,alignSelf:'flex-end'},messagesContainer:{flex:1},inputContainer:{position:'absolute',left:0,right:0,bottom:0,flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingVertical:8,backgroundColor:COLORS.surface,borderTopWidth:1,borderTopColor:COLORS.border,zIndex:100},input:{flex:1,backgroundColor:COLORS.inputBg,borderRadius:20,paddingHorizontal:16,paddingVertical:10,color:COLORS.text,fontSize:15,maxHeight:100,marginRight:8},sendButton:{width:40,height:40,borderRadius:20,backgroundColor:COLORS.primary,justifyContent:'center',alignItems:'center'},sendIcon:{color:COLORS.text,fontSize:16}});
;// ./index.js
(0,registerRootComponent["default"])(App);

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkweb"] = self["webpackChunkweb"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [509], () => (__webpack_require__(3704)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.726aadac.js.map