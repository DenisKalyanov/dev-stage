(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{30:function(e,a,t){e.exports=t(60)},59:function(e,a,t){},60:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),l=t(26),c=t.n(l),o=t(7),s=t(1);var m=function(){return r.a.createElement("section",{className:"landing"},r.a.createElement("div",{className:"dark-overlay"},r.a.createElement("div",{className:"landing-inner"},r.a.createElement("h1",{className:"x-large"},"Developer Connector"),r.a.createElement("p",{className:"lead"},"Create a developer profile/portfolio, share posts and get help from other developers"),r.a.createElement("div",{className:"buttons"},r.a.createElement(o.b,{to:"/register",className:"btn btn-primary"},"Sign Up"),r.a.createElement(o.b,{to:"/login",className:"btn btn-light"},"Login")))))};var i=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("nav",{className:"navbar bg-dark"},r.a.createElement("h1",null,r.a.createElement(o.b,{to:"/"},r.a.createElement("i",{className:"fas fa-code"})," DevConnector")),r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement(o.b,{to:"/profiles"},"Developers")),r.a.createElement("li",null,r.a.createElement(o.b,{to:"/register"},"Register")),r.a.createElement("li",null,r.a.createElement(o.b,{to:"/login"},"Login")))))};var u=function(){return r.a.createElement(r.a.Fragment,null,"Login")},p=t(14),E=t.n(p),d=t(28),g=t(10),f=t(15),v=t(29),h=t(41);var b=function(){var e=Object(n.useState)({name:"",email:"",password:"",confirmPassword:""}),a=Object(v.a)(e,2),t=a[0],l=a[1],c=t.name,o=t.email,s=t.password,m=t.confirmPassword,i=function(e){l(Object(f.a)(Object(f.a)({},t),{},Object(g.a)({},e.target.name,e.target.value)))},u=function(){var e=Object(d.a)(E.a.mark((function e(a){var t,n,r,l;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.preventDefault(),s===m){e.next=5;break}console.log("Password do not match"),e.next=22;break;case 5:return t={name:c,email:o,password:s},e.prev=6,n={headers:{"Content-Type":"application/json"}},r=JSON.stringify(t),console.log(r),console.log(n),e.next=13,h.post("/api/users",r,n);case 13:l=e.sent,console.log("HERERERE"),console.log(l),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(6),console.error(e.t0);case 21:case 22:case 23:case"end":return e.stop()}}),e,null,[[6,18]])})));return function(a){return e.apply(this,arguments)}}();return r.a.createElement("section",{className:"container"},r.a.createElement("h1",{className:"large text-primary"},"Sign Up"),r.a.createElement("p",{className:"lead"},r.a.createElement("i",{className:"fas fa-user"})," Create Your Account"),r.a.createElement("form",{className:"form",onSubmit:u},r.a.createElement("div",{className:"form-group"},r.a.createElement("input",{type:"text",placeholder:"Name",name:"name",required:!0,value:c,onChange:i})),r.a.createElement("div",{className:"form-group"},r.a.createElement("input",{type:"email",placeholder:"Email Address",name:"email",value:o,onChange:i}),r.a.createElement("small",{className:"form-text"},"This site uses Gravatar so if you want a profile image, use a Gravatar email")),r.a.createElement("div",{className:"form-group"},r.a.createElement("input",{type:"password",placeholder:"Password",name:"password",minLength:"6",value:s,onChange:i})),r.a.createElement("div",{className:"form-group"},r.a.createElement("input",{type:"password",placeholder:"Confirm Password",name:"confirmPassword",minLength:"6",value:m,onChange:i})),r.a.createElement("input",{type:"submit",className:"btn btn-primary",value:"Register"})),r.a.createElement("p",{className:"my-1"}," Already have an account? ",r.a.createElement("a",{href:"login.html"},"Sign In")))};t(59);var N=function(){return r.a.createElement(o.a,null,r.a.createElement(i,null),r.a.createElement(s.a,{exact:!0,path:"/",component:m}),r.a.createElement("section",{className:"container"},r.a.createElement(s.c,null,r.a.createElement(s.a,{exact:!0,path:"/register",component:b}),r.a.createElement(s.a,{exact:!0,path:"/login",component:u}))))};c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(N,null)),document.getElementById("root"))}},[[30,1,2]]]);
//# sourceMappingURL=main.ffd02ca6.chunk.js.map