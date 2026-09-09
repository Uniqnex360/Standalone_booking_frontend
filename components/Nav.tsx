"use client"; import Link from "next/link"; import {useEffect,useState} from "react";
export default function Nav(){const [user,setUser]=useState<any>(null);useEffect(()=>{fetch("/api/me").then(r=>r.json()).then(d=>setUser(d.user))},[]);
async function logout(){await fetch("/api/auth/logout",{method:"POST"});location.href="/";}
return <nav className="nav"><Link className="brand" href="/">Chennai Movies</Link>{user?<span>{user.name} · <button onClick={logout}>Logout</button></span>:<Link href="/login">Login</Link>}</nav>}