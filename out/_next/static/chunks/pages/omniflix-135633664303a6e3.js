(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[270],{5748:function(e,i,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/omniflix",function(){return n(9735)}])},9397:function(e,i,n){"use strict";n.d(i,{W:function(){return o}});var s=n(5893),a=n(4680),l=n(4056),t=n(1707),r=n(1664),c=n.n(r);function o(e){let{chainName:i}=e,n=l.p5.find(e=>e.chain_name===i);return n?(0,s.jsxs)(a.Zb,{children:[(0,s.jsx)(a.Ol,{children:(0,s.jsxs)(a.ll,{children:["About ",n.pretty_name||n.chain_name]})}),(0,s.jsxs)(a.aY,{className:"space-y-4",children:[(0,s.jsx)("div",{className:"text-sm text-muted-foreground",children:n.description}),n.website&&(0,s.jsxs)(c(),{href:n.website,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center text-sm text-primary hover:underline",children:["Visit Website",(0,s.jsx)(t.Z,{className:"ml-1 h-3 w-3"})]})]})]}):null}},9735:function(e,i,n){"use strict";n.r(i),n.d(i,{default:function(){return b}});var s=n(5893),a=n(6800),l=n(3954),t=n(7156),r=n(3215),c=n(2572),o=n(9397),d=n(2609),m=n(1188),u=n(6111),x=n(8082),h=n(4598),f=n(7294);function b(){let{address:e,status:i,balance:n,stakedBalance:b,unclaimedRewards:N,isLoading:j,error:p,connect:w}=(0,l.Z)("omniflixhub");return(0,f.useEffect)(()=>{"Disconnected"!==i||j||w()},[i,j,w]),(0,s.jsxs)("div",{className:"flex min-h-screen flex-col",children:[(0,s.jsx)(a.h,{chainName:"omniflixhub"}),(0,s.jsxs)("main",{className:"flex-1 space-y-4 p-8 pt-6",children:[(0,s.jsx)("div",{className:"flex items-center justify-between",children:(0,s.jsx)("h1",{className:"text-3xl font-bold",children:"OmniFlix Dashboard"})}),i&&"Disconnected"!==i?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,s.jsx)(t.A,{title:"Available FLIX",type:"available",value:Number(n),icon:(0,s.jsx)(d.Z,{className:"h-4 w-4 text-muted-foreground"}),description:"Available balance in your wallet",isLoading:j,tokenSymbol:"FLIX",chainName:"omniflixhub"}),(0,s.jsx)(t.A,{title:"Staked FLIX",type:"staked",value:Number(b),icon:(0,s.jsx)(m.Z,{className:"h-4 w-4 text-muted-foreground"}),description:"Total FLIX staked",isLoading:j,tokenSymbol:"FLIX",chainName:"omniflixhub"}),(0,s.jsx)(t.A,{title:"Unclaimed Rewards",type:"unclaimed",value:Number(N),icon:(0,s.jsx)(d.Z,{className:"h-4 w-4 text-muted-foreground"}),description:"Claimable staking rewards",isLoading:j,tokenSymbol:"FLIX",chainName:"omniflixhub"}),(0,s.jsx)(t.A,{title:"Total Value",type:"converted",value:Number(n)+Number(b)+Number(N),icon:(0,s.jsx)(u.Z,{className:"h-4 w-4 text-muted-foreground"}),description:"Total value of all FLIX",isLoading:j,tokenSymbol:"FLIX",chainName:"omniflixhub"})]}),(0,s.jsxs)("div",{className:"grid gap-4 grid-cols-1 md:grid-cols-2",children:[(0,s.jsx)(r._,{chainName:"omniflixhub"}),(0,s.jsx)(c.k,{chainName:"omniflixhub"})]}),(0,s.jsx)(o.W,{chainName:"omniflixhub"})]}):(0,s.jsxs)(x.bZ,{children:[(0,s.jsx)(h.Z,{className:"h-4 w-4"}),(0,s.jsx)(x.X,{children:"Connect your wallet to view your OmniFlix balances and rewards"})]})]})]})}}},function(e){e.O(0,[605,222,425,878,929,56,800,690,888,774,179],function(){return e(e.s=5748)}),_N_E=e.O()}]);