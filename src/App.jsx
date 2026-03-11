import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line } from "recharts";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Epilogue:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#fafaf8;--surface:#ffffff;--surface2:#f4f3f0;--border:#e8e8e4;--border2:#d4d3ce;
  --ink:#1a1a1a;--ink2:#2d2d2d;--muted:#6b7280;
  --navy:#0f1f3d;--navy-mid:#1a3358;--navy-light:#eef1f7;
  --gold:#c9a84c;--gold-mid:#d4a843;--gold-light:#fdf6e3;
  --red:#c0392b;--red-light:#fdeaea;
  --green:#1a6e42;--green-light:#e5f2eb;
  --amber:#b86e00;--amber-light:#fdf0e0;
  --blue:#1a3f8f;--blue-light:#e5ecf8;
  --purple:#5a2d8f;--purple-light:#f0eafc;
  --shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04);
  --shadow-md:0 4px 20px rgba(0,0,0,0.08);
}
body{background:var(--bg);color:var(--ink);font-family:'Epilogue',sans-serif;min-height:100vh;}
button,input,select,textarea{font-family:'Epilogue',sans-serif;}

/* LOGIN */
.login-wrap{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
.login-left{background:var(--navy);display:flex;flex-direction:column;justify-content:space-between;padding:48px;position:relative;overflow:hidden;}
.login-left::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(201,168,76,0.18) 0%,transparent 65%);}
.login-left::after{content:'';position:absolute;bottom:0;right:0;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,0.02);transform:translate(40%,40%);}
.login-brand{position:relative;z-index:1;}
.login-brand-name{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.02em;}
.login-brand-name span{color:var(--gold);}
.login-brand-tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-top:4px;}
.login-hero{position:relative;z-index:1;}
.login-hero h1{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:16px;}
.login-hero h1 em{color:var(--gold);font-style:italic;font-family:'Epilogue',sans-serif;font-weight:300;}
.login-hero p{font-size:14px;color:rgba(255,255,255,0.42);line-height:1.7;max-width:340px;}
.login-badges{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1;}
.login-badge{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);border:1px solid rgba(255,255,255,0.1);padding:6px 14px;border-radius:20px;}
.login-right{display:flex;align-items:center;justify-content:center;padding:48px;background:var(--bg);}
.login-card{width:100%;max-width:420px;}
.login-card h2{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;margin-bottom:6px;color:var(--navy);}
.login-card p{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.6;}
.role-pick{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px;}
.role-btn{padding:18px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface);cursor:pointer;text-align:center;transition:all 0.15s;}
.role-btn:hover{border-color:var(--navy);}
.role-btn.selected{border-color:var(--navy);background:var(--navy-light);}
.role-btn-icon{font-size:24px;margin-bottom:8px;}
.role-btn-label{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--ink);}
.role-btn-sub{font-size:11px;color:var(--muted);margin-top:2px;}

/* LAYOUT */
.app-shell{display:flex;min-height:100vh;}
.sidebar{width:236px;flex-shrink:0;background:var(--navy);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.logo-wrap{padding:26px 22px 20px;border-bottom:1px solid rgba(255,255,255,0.06);}
.logo-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.01em;}
.logo-name span{color:var(--gold);}
.logo-role{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-top:3px;}
.nav-section{padding:18px 12px 6px;}
.nav-section-lbl{font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:0 8px;margin-bottom:4px;}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:7px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.12s;border:none;background:transparent;width:100%;text-align:left;}
.nav-item:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.78);}
.nav-item.active{background:rgba(201,168,76,0.12);color:var(--gold);}
.nav-icon{font-size:14px;width:18px;text-align:center;flex-shrink:0;}
.nav-pill{margin-left:auto;background:rgba(201,168,76,0.2);color:var(--gold);font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;}
.nav-pill-red{margin-left:auto;background:rgba(192,57,43,0.25);color:#e07070;font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;}
.sidebar-foot{margin-top:auto;padding:14px 12px;border-top:1px solid rgba(255,255,255,0.06);}
.s-user{display:flex;align-items:center;gap:9px;}
.s-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
.s-name{font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s-role{font-size:10px;color:rgba(255,255,255,0.28);}
.logout-btn{background:none;border:none;color:rgba(255,255,255,0.22);font-size:11px;cursor:pointer;margin-left:auto;padding:4px;}
.logout-btn:hover{color:rgba(255,255,255,0.55);}
.main{flex:1;min-width:0;display:flex;flex-direction:column;}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
.topbar-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--navy);}
.topbar-sub{font-size:11px;color:var(--muted);margin-top:1px;}
.page{padding:24px 28px;flex:1;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:9px 18px;border:none;border-radius:7px;cursor:pointer;transition:all 0.13s;letter-spacing:0.01em;}
.btn-primary{background:var(--navy);color:#fff;}.btn-primary:hover{background:var(--navy-mid);}
.btn-secondary{background:var(--surface2);color:var(--ink2);border:1px solid var(--border);}.btn-secondary:hover{background:var(--border);}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border);}.btn-ghost:hover{color:var(--ink);border-color:var(--border2);}
.btn-gold{background:var(--gold);color:#fff;}.btn-gold:hover{background:var(--gold-mid);}
.btn-emp{background:var(--navy);color:#fff;}.btn-emp:hover{background:var(--navy-mid);}
.btn-danger{background:var(--red-light);color:var(--red);border:1px solid rgba(192,57,43,0.2);}
.btn-sm{font-size:11px;padding:6px 13px;}.btn-xs{font-size:10px;padding:4px 9px;border-radius:5px;}

/* CARDS */
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow);}
.card-hd{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.card-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--navy);}
.card-body{padding:20px;}

/* STATS */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;box-shadow:var(--shadow);position:relative;overflow:hidden;}
.stat-lbl{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.stat-val{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;line-height:1;margin-bottom:5px;}
.stat-note{font-size:11px;color:var(--muted);}

/* TAGS */
.tag{display:inline-flex;align-items:center;font-size:10px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:20px;}
.t-teal{background:var(--navy-light);color:var(--navy);}
.t-amber{background:var(--amber-light);color:var(--amber);}
.t-red{background:var(--red-light);color:var(--red);}
.t-green{background:var(--green-light);color:var(--green);}
.t-blue{background:var(--blue-light);color:var(--blue);}
.t-purple{background:var(--purple-light);color:var(--purple);}
.t-gray{background:var(--surface2);color:var(--muted);}
.t-gold{background:var(--gold-light);color:#8a6d1f;}

/* TABLE */
table{width:100%;border-collapse:collapse;}
th{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);padding:9px 14px;text-align:left;border-bottom:1px solid var(--border);}
td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--surface2);}

/* FORMS */
.form-group{margin-bottom:16px;}
.form-lbl{display:block;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink2);margin-bottom:6px;}
.form-input,.form-select,.form-textarea{width:100%;background:var(--surface);border:1.5px solid var(--border);color:var(--ink);font-size:13px;padding:9px 13px;border-radius:7px;outline:none;transition:border-color 0.13s;appearance:none;}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--navy);}
.form-select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 5 5-5' stroke='%23888' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-textarea{resize:vertical;min-height:100px;}

/* PROGRESS */
.prog{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;border:1px solid var(--border);}
.prog-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(15,31,61,0.35);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.18s ease;}
.modal{background:var(--surface);border-radius:12px;box-shadow:0 20px 60px rgba(15,31,61,0.16);max-width:680px;width:92%;max-height:90vh;display:flex;flex-direction:column;animation:slideUp 0.2s ease;}
.modal-wide{max-width:900px;}
.modal-hd{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.modal-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--navy);}
.modal-x{background:none;border:none;font-size:20px;color:var(--muted);cursor:pointer;}
.modal-body{padding:24px;overflow-y:auto;flex:1;}
.modal-ft{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;}

/* TABS */
.tabs{display:flex;gap:2px;background:var(--surface2);border-radius:8px;padding:3px;margin-bottom:20px;border:1px solid var(--border);}
.tab-btn{flex:1;font-size:12px;font-weight:600;padding:7px 12px;border:none;border-radius:6px;cursor:pointer;color:var(--muted);background:transparent;transition:all 0.13s;}
.tab-btn.active{background:var(--surface);color:var(--navy);box-shadow:var(--shadow);}

/* ALERTS */
.alert{padding:11px 14px;border-radius:7px;font-size:12px;margin-bottom:14px;display:flex;align-items:flex-start;gap:8px;line-height:1.5;}
.a-info{background:var(--navy-light);color:var(--navy);border:1px solid rgba(15,31,61,0.1);}
.a-success{background:var(--green-light);color:var(--green);border:1px solid rgba(26,110,66,0.12);}
.a-warn{background:var(--amber-light);color:var(--amber);border:1px solid rgba(184,110,0,0.12);}
.a-purple{background:var(--purple-light);color:var(--purple);border:1px solid rgba(90,45,143,0.12);}
.a-gold{background:var(--gold-light);color:#7a5f1f;border:1px solid rgba(201,168,76,0.2);}

/* GAP ANALYSIS */
.gap-row{margin-bottom:13px;}
.gap-row-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
.gap-track{height:9px;background:var(--border);border-radius:5px;position:relative;overflow:hidden;}
.gap-req{position:absolute;top:0;left:0;height:100%;background:var(--border2);border-radius:5px;}
.gap-act{position:absolute;top:0;left:0;height:100%;border-radius:5px;transition:width 0.8s ease;}

/* DEV PLAN */
.dev-phase{border:1px solid var(--border);border-radius:8px;margin-bottom:10px;overflow:hidden;}
.dev-ph-hd{background:var(--navy-light);padding:11px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);}
.dev-ph-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--navy);}
.dev-ph-body{padding:14px;display:flex;flex-direction:column;gap:7px;}
.dev-action{display:flex;gap:8px;font-size:12px;align-items:flex-start;line-height:1.5;}
.dev-bullet{color:var(--gold);font-weight:700;flex-shrink:0;}

/* EMPLOYEE HERO */
.emp-hero{background:linear-gradient(135deg,var(--navy) 0%,#1a2f5e 100%);border-radius:12px;padding:28px 32px;margin-bottom:20px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.emp-hero::before{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(201,168,76,0.06);}
.emp-hero::after{content:'';position:absolute;left:-40px;bottom:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.02);}
.emp-hero-left{position:relative;z-index:1;}
.emp-hero-greeting{font-size:12px;color:rgba(255,255,255,0.38);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
.emp-hero-name{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fff;margin-bottom:4px;}
.emp-hero-role{font-size:13px;color:rgba(255,255,255,0.48);}
.emp-hero-right{position:relative;z-index:1;text-align:center;flex-shrink:0;}
.emp-score-ring{width:90px;height:90px;border-radius:50%;border:2px solid rgba(201,168,76,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(201,168,76,0.06);}
.emp-score-num{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--gold);line-height:1;}
.emp-score-lbl{font-size:9px;color:rgba(255,255,255,0.32);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;}

/* QUIZ */
.quiz-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:28px;box-shadow:var(--shadow);}
.quiz-q{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:6px;line-height:1.3;color:var(--navy);}
.quiz-options{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;}
.quiz-opt{border:1.5px solid var(--border);border-radius:8px;padding:13px 16px;cursor:pointer;transition:all 0.13s;text-align:left;font-size:13px;background:var(--surface);display:flex;align-items:center;gap:10px;}
.quiz-opt:hover{border-color:var(--navy);}
.quiz-opt.selected{border-color:var(--navy);background:var(--navy-light);color:var(--navy);font-weight:600;}
.quiz-radio{width:14px;height:14px;border:1.5px solid currentColor;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.quiz-opt.selected .quiz-radio::after{content:'';width:6px;height:6px;border-radius:50%;background:var(--navy);}
.quiz-progress-bar{height:3px;background:var(--border);border-radius:2px;margin-bottom:20px;}
.quiz-prog-fill{height:100%;background:var(--gold);border-radius:2px;transition:width 0.4s ease;}

/* NOTIFICATIONS */
.notif-item{display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.12s;}
.notif-item:hover{background:var(--surface2);}
.notif-item.unread{background:var(--navy-light);}
.notif-dot{width:8px;height:8px;border-radius:50%;background:var(--navy);flex-shrink:0;margin-top:4px;}
.notif-dot.read{background:var(--border2);}
.notif-title{font-size:13px;font-weight:600;margin-bottom:3px;}
.notif-sub{font-size:11px;color:var(--muted);line-height:1.5;}
.notif-time{font-size:10px;color:var(--muted);margin-top:4px;}

/* JD UPLOAD */
.jd-drop{border:2px dashed var(--border2);border-radius:10px;padding:32px;text-align:center;cursor:pointer;transition:all 0.15s;}
.jd-drop:hover,.jd-drop.dragover{border-color:var(--navy);background:var(--navy-light);}
.jd-drop-icon{font-size:32px;margin-bottom:10px;}
.jd-drop-text{font-size:13px;font-weight:600;margin-bottom:4px;}
.jd-drop-sub{font-size:11px;color:var(--muted);}

/* WIZARD STEPS */
.wizard-steps{display:flex;align-items:center;gap:0;margin-bottom:28px;}
.wizard-step{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;}
.wizard-step:not(:last-child)::after{content:'';position:absolute;top:14px;left:50%;width:100%;height:1px;background:var(--border);}
.wizard-step.done::after{background:var(--gold);}
.wizard-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--muted);position:relative;z-index:1;transition:all 0.2s;}
.wizard-step.active .wizard-dot{border-color:var(--navy);color:var(--navy);}
.wizard-step.done .wizard-dot{border-color:var(--gold);background:var(--gold);color:#fff;}
.wizard-lbl{font-size:10px;font-weight:600;color:var(--muted);margin-top:6px;text-align:center;}
.wizard-step.active .wizard-lbl{color:var(--navy);}
.wizard-step.done .wizard-lbl{color:var(--gold);}

/* COMPARISON */
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.compare-header{text-align:center;padding:16px;background:var(--navy-light);border-radius:8px;margin-bottom:16px;border:1px solid rgba(15,31,61,0.08);}
.compare-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--navy);}
.compare-score{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;margin:4px 0;}
.compare-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.compare-bar-label{font-size:11px;color:var(--muted);width:100px;flex-shrink:0;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
.compare-bar-track{flex:1;height:7px;background:var(--border);border-radius:4px;overflow:hidden;}
.compare-bar-fill{height:100%;border-radius:4px;transition:width 0.8s ease;}

/* TEST CARDS (Gap Wizard) */
.test-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:24px;box-shadow:var(--shadow);}
.test-type-badge{display:inline-block;font-size:11px;font-weight:600;padding:4px 10px;border-radius:5px;margin-bottom:14px;}
.test-scenario-box{background:var(--navy-light);border:1px solid rgba(15,31,61,0.1);border-left:3px solid var(--navy);border-radius:7px;padding:12px 14px;font-size:12px;color:var(--ink2);margin-bottom:16px;line-height:1.6;}
.test-q{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:18px;line-height:1.35;color:var(--navy);}
.test-short-area{width:100%;background:var(--surface);border:1.5px solid var(--border);color:var(--ink);font-size:13px;padding:10px 13px;border-radius:7px;outline:none;min-height:100px;resize:vertical;transition:border-color 0.13s;font-family:'Epilogue',sans-serif;line-height:1.6;}
.test-short-area:focus{border-color:var(--navy);}
.test-dot-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.test-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);background:var(--surface2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--muted);transition:all 0.12s;}
.test-dot.answered{background:var(--navy-light);border-color:var(--navy);color:var(--navy);}
.test-dot.current{background:var(--navy);border-color:var(--navy);color:#fff;}
.test-nav{display:flex;justify-content:space-between;}

/* METHOD CARDS */
.method-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;}
.method-card{border:2px solid var(--border);border-radius:10px;padding:20px;cursor:pointer;transition:all 0.15s;background:var(--surface);}
.method-card:hover{border-color:var(--navy);background:var(--navy-light);}
.method-card.selected{border-color:var(--navy);background:var(--navy-light);}
.method-card.emp:hover{border-color:var(--gold);background:var(--gold-light);}
.method-card.emp.selected{border-color:var(--gold);background:var(--gold-light);}
.method-card-icon{font-size:28px;margin-bottom:10px;}
.method-card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:6px;color:var(--navy);}
.method-card-desc{font-size:12px;color:var(--muted);line-height:1.5;}

/* SKILL RESULT CARDS */
.skill-result-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;margin-bottom:10px;overflow:hidden;}
.skill-result-hd{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--surface2);border-bottom:1px solid var(--border);}
.skill-result-body{padding:12px 14px;}
.skill-rec{font-size:12px;color:var(--muted);background:var(--gold-light);border-radius:5px;padding:7px 10px;margin-top:6px;line-height:1.5;border:1px solid rgba(201,168,76,0.15);}

/* EMPTY STATE */
.empty{text-align:center;padding:40px 20px;}
.empty-icon{font-size:36px;margin-bottom:10px;opacity:0.35;}
.empty-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--muted);}

/* SPINNER */
.spinner{width:28px;height:28px;border:2.5px solid var(--border);border-top-color:var(--navy);border-radius:50%;animation:spin 0.7s linear infinite;}
.spinner-gold{border-top-color:var(--gold);}
.spinner-purple{border-top-color:var(--purple);}
.loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:60px 20px;text-align:center;}

/* EQ SLIDER */
.eq-slider-wrap{margin-bottom:18px;}
.eq-slider-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.eq-slider-label{font-size:13px;font-weight:600;color:var(--navy);}
.eq-slider-val{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--gold);}
.eq-slider{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:var(--border);outline:none;cursor:pointer;}
.eq-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--navy);border:3px solid var(--gold);cursor:pointer;}
.eq-dim-desc{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.5;}

/* EQ RADAR */
.eq-profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.eq-dim-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);}
.eq-dim-name{font-size:12px;font-weight:600;min-width:160px;color:var(--navy);}
.eq-bar-wrap{flex:1;display:flex;gap:6px;flex-direction:column;}
.eq-bar-track{height:6px;background:var(--border);border-radius:3px;overflow:hidden;}
.eq-bar-self{height:100%;border-radius:3px;background:var(--navy);}
.eq-bar-mgr{height:100%;border-radius:3px;background:var(--gold);}
.eq-scores{display:flex;gap:8px;align-items:center;}
.eq-score-self{font-size:11px;font-weight:700;color:var(--navy);}
.eq-score-mgr{font-size:11px;font-weight:700;color:#8a6d1f;}
.eq-gap-badge{font-size:10px;padding:2px 7px;border-radius:10px;font-weight:700;}

/* SIMULATION */
.sim-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:24px;box-shadow:var(--shadow);}
.sim-scenario{background:var(--navy-light);border-left:3px solid var(--navy);border-radius:7px;padding:14px 16px;font-size:13px;line-height:1.7;color:var(--ink2);margin-bottom:20px;}
.sim-question{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;line-height:1.35;}
.sim-opt{border:1.5px solid var(--border);border-radius:8px;padding:13px 16px;cursor:pointer;transition:all 0.13s;text-align:left;font-size:13px;background:var(--surface);display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;width:100%;}
.sim-opt:hover{border-color:var(--navy);background:var(--navy-light);}
.sim-opt.selected{border-color:var(--gold);background:var(--gold-light);font-weight:600;}
.sim-opt-letter{width:22px;height:22px;border-radius:50%;background:var(--surface2);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--muted);flex-shrink:0;margin-top:1px;}
.sim-opt.selected .sim-opt-letter{background:var(--gold);border-color:var(--gold);color:#fff;}
.sim-result{background:var(--gold-light);border:1px solid rgba(201,168,76,0.25);border-radius:8px;padding:14px 16px;margin-top:16px;}
.sim-result-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px;}
.sim-result-body{font-size:12px;color:var(--ink2);line-height:1.6;}

/* MENTOR MATCH CARD */
.mentor-match-card{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:22px;box-shadow:var(--shadow);}
.mentor-match-card.top{border-color:var(--gold);background:linear-gradient(135deg,#fffdf5 0%,var(--surface) 100%);}
.mentor-score-ring{width:64px;height:64px;border-radius:50%;border:2.5px solid var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--gold-light);flex-shrink:0;}
.mentor-score-num{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--navy);line-height:1;}
.mentor-score-lbl{font-size:8px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;}
.mentor-tag{display:inline-block;font-size:10px;font-weight:700;padding:3px 9px;border-radius:12px;background:var(--navy-light);color:var(--navy);margin:3px 3px 3px 0;}
.why-matched{background:var(--navy-light);border-radius:7px;padding:12px 14px;margin-top:12px;}
.why-matched-title{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--navy);margin-bottom:6px;}
.why-matched-item{font-size:12px;color:var(--ink2);padding:3px 0;display:flex;gap:6px;line-height:1.5;}

/* MENTOR PORTAL */
.mentee-profile-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;display:flex;gap:14px;align-items:flex-start;cursor:pointer;transition:all 0.13s;}
.mentee-profile-card:hover{border-color:var(--navy);background:var(--navy-light);}
.session-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:8px;}
.session-dim-tag{font-size:10px;font-weight:700;padding:3px 9px;border-radius:12px;background:var(--navy);color:var(--gold);display:inline-block;margin-right:5px;}

/* HR EQ */
.eq-heatmap-cell{width:44px;height:44px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;}
.eq-heatmap{display:grid;gap:4px;}

/* ANIMATIONS */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn 0.2s ease;}
`;

/* ─── API ─────────────────────────────────────────────────────────────────── */
const apiKey = "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";
async function askClaude(system, user, maxTokens=1500) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error("API error:", data); return null; }
    const raw = data.content?.map(b => b.text || "").join("") || "";
    try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
    catch { console.error("JSON parse error:", raw); return null; }
  } catch (err) { console.error("Fetch error:", err); return null; }
}

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const WEIGHTS = ["Critical","High","Medium","Low"];
const WC = { Critical:"t-red", High:"t-amber", Medium:"t-teal", Low:"t-gray" };
const DEPTS = ["Engineering","Product","Marketing","HR","Finance","Operations","Design","Legal","Sales"];
const LEVELS = ["Junior (0–2 yrs)","Mid-level (3–5 yrs)","Senior (5–8 yrs)","Lead (8–12 yrs)","Executive (12+ yrs)"];

/* ─── SEED DATA ──────────────────────────────────────────────────────────── */
const SEED_POSITIONS = [
  { id:1, title:"Senior Software Engineer", department:"Engineering", level:"Senior (5–8 yrs)", type:"Internal & External", jdText:"Lead backend systems design, mentor junior engineers, own full software delivery lifecycle.",
    criteria:[{skill:"System Design",required:85,weight:"Critical"},{skill:"Programming Proficiency",required:80,weight:"Critical"},{skill:"Code Review & Mentoring",required:70,weight:"High"},{skill:"Problem Solving",required:80,weight:"High"},{skill:"Communication",required:60,weight:"Medium"},{skill:"Agile/Scrum",required:65,weight:"Medium"}]},
  { id:2, title:"Product Manager", department:"Product", level:"Mid-level (3–5 yrs)", type:"Internal & External", jdText:"Own product roadmap, work cross-functionally, define success metrics and drive OKRs.",
    criteria:[{skill:"Product Strategy",required:80,weight:"Critical"},{skill:"Stakeholder Management",required:75,weight:"High"},{skill:"Data Analysis",required:70,weight:"High"},{skill:"User Research",required:65,weight:"High"},{skill:"Roadmap Planning",required:75,weight:"Critical"},{skill:"Cross-functional Leadership",required:70,weight:"Medium"}]},
];

const EQ_DIMS = [
  {key:"selfAwareness",label:"Self-Awareness",desc:"Understanding own emotions, triggers, and patterns"},
  {key:"selfRegulation",label:"Self-Regulation",desc:"Managing emotions and responses under pressure"},
  {key:"empathy",label:"Empathy",desc:"Reading others' emotions and perspectives accurately"},
  {key:"relationshipManagement",label:"Relationship Management",desc:"Navigating conflict and building trust"},
  {key:"motivation",label:"Motivation",desc:"Inner drive and resilience through setbacks"},
];

const SIMULATIONS = [
  {id:"s1",category:"Conflict",title:"The Disagreement in the Meeting",
   scenario:"During a team meeting, a colleague publicly challenges your technical decision in front of senior leadership. Their tone is dismissive and they interrupt you twice.",
   question:"What do you do?",
   options:[
     {letter:"A",text:"Let it go for now and speak to them privately afterward to address the tone.",eqMap:{selfRegulation:9,empathy:7,relationshipManagement:8}},
     {letter:"B",text:"Firmly but calmly respond in the meeting — your reasoning is sound and the team deserves clarity.",eqMap:{selfAwareness:8,selfRegulation:6,motivation:7}},
     {letter:"C",text:"Go quiet and defer the discussion — conflict in front of leadership is never a good idea.",eqMap:{selfRegulation:4,selfAwareness:4,empathy:5}},
   ]},
  {id:"s2",category:"Feedback",title:"The Tough Feedback Conversation",
   scenario:"A junior team member's work has been consistently below expectations for 6 weeks. They're clearly trying hard but the output just isn't landing. You need to give them feedback.",
   question:"How do you approach it?",
   options:[
     {letter:"A",text:"Wait a bit longer — they seem to be improving and feedback might knock their confidence.",eqMap:{empathy:5,relationshipManagement:4,selfRegulation:5}},
     {letter:"B",text:"Have a direct, private conversation — share specific examples, be honest about the impact, and ask what they need from you.",eqMap:{empathy:9,relationshipManagement:9,selfAwareness:8}},
     {letter:"C",text:"Raise it in the next team retrospective so the group can address quality standards together.",eqMap:{empathy:3,relationshipManagement:3,selfRegulation:5}},
   ]},
  {id:"s3",category:"Leadership",title:"The Demoralised Team",
   scenario:"Your team just had a project cancelled after 3 months of work. Morale is low. Two strong team members are quietly looking for other jobs. You have a team meeting in an hour.",
   question:"How do you open the meeting?",
   options:[
     {letter:"A",text:"Acknowledge the loss directly — name how hard the team worked, validate the disappointment, then talk about what's next.",eqMap:{empathy:9,selfAwareness:8,motivation:9,relationshipManagement:8}},
     {letter:"B",text:"Stay positive — focus on new opportunities ahead and what the team learned from the experience.",eqMap:{motivation:6,empathy:5,selfAwareness:5}},
     {letter:"C",text:"Keep it brief and businesslike — dwelling on it won't help, and the team needs direction, not processing time.",eqMap:{empathy:3,selfAwareness:4,motivation:5}},
   ]},
  {id:"s4",category:"Executive Presence",title:"Disagreeing With a Senior Leader",
   scenario:"In a leadership meeting, the VP proposes a direction that you believe is wrong — and you have data to back your view. Others in the room are nodding along.",
   question:"What do you do?",
   options:[
     {letter:"A",text:"Raise your concern respectfully in the meeting — share your data, frame it as wanting to stress-test the idea, and invite discussion.",eqMap:{selfAwareness:9,selfRegulation:8,motivation:9,empathy:7}},
     {letter:"B",text:"Say nothing in the meeting — schedule a private conversation with the VP afterward to share your view.",eqMap:{selfRegulation:6,empathy:6,selfAwareness:6}},
     {letter:"C",text:"Go along with the direction — you may be missing context and it's not your call.",eqMap:{selfAwareness:3,motivation:3,selfRegulation:4}},
   ]},
  {id:"s5",category:"Self-Awareness",title:"The Critical Performance Review",
   scenario:"Your manager gives you a review that is significantly more negative than you expected. Some of the feedback feels unfair, but some of it resonates uncomfortably.",
   question:"What is your immediate internal response?",
   options:[
     {letter:"A",text:"Feel defensive — you've been working extremely hard and this doesn't reflect the full picture.",eqMap:{selfAwareness:4,selfRegulation:4,empathy:5}},
     {letter:"B",text:"Sit with the discomfort — try to separate your emotional reaction from the content and identify what rings true.",eqMap:{selfAwareness:9,selfRegulation:9,empathy:7}},
     {letter:"C",text:"Ask for specific examples for each point so you can assess it objectively before forming a view.",eqMap:{selfAwareness:8,selfRegulation:7,motivation:8}},
   ]},
];

const SEED_EMPLOYEES = [
  { id:101, name:"Priya Nair", role:"Senior Engineer", email:"priya@company.com", password:"priya123", type:"Internal", positionId:1, department:"Engineering", experience:"6 years",
    scores:{"System Design":82,"Programming Proficiency":88,"Code Review & Mentoring":65,"Problem Solving":78,"Communication":72,"Agile/Scrum":70},
    quizHistory:[], devPlan:null, certifications:null, selfGapChecks:[],
    progressLog:[{date:"Jan",score:64},{date:"Feb",score:68},{date:"Mar",score:72},{date:"Apr",score:76},{date:"May",score:80},{date:"Jun",score:82}],
    eq:{self:{selfAwareness:6,selfRegulation:5,empathy:7,relationshipManagement:4,motivation:8},manager:{selfAwareness:5,selfRegulation:4,empathy:6,relationshipManagement:3,motivation:7},history:[{date:"Jan 2026",overall:5.8},{date:"Feb 2026",overall:6.1},{date:"Mar 2026",overall:6.4}],simulations:[],matchedMentorId:null,matchScore:0}},
  { id:102, name:"James Okafor", role:"Product Lead", email:"james@company.com", password:"james123", type:"Internal", positionId:2, department:"Product", experience:"5 years",
    scores:{"Product Strategy":75,"Stakeholder Management":80,"Data Analysis":68,"User Research":72,"Roadmap Planning":78,"Cross-functional Leadership":65},
    quizHistory:[], devPlan:null, certifications:null, selfGapChecks:[],
    progressLog:[{date:"Jan",score:60},{date:"Feb",score:63},{date:"Mar",score:66},{date:"Apr",score:70},{date:"May",score:73},{date:"Jun",score:75}],
    eq:{self:{selfAwareness:7,selfRegulation:6,empathy:5,relationshipManagement:7,motivation:6},manager:{selfAwareness:6,selfRegulation:5,empathy:5,relationshipManagement:6,motivation:6},history:[{date:"Jan 2026",overall:6.0},{date:"Feb 2026",overall:6.2},{date:"Mar 2026",overall:6.5}],simulations:[],matchedMentorId:null,matchScore:0}},
  { id:103, name:"Sofia Mendez", role:"Junior Engineer", email:"sofia@company.com", password:"sofia123", type:"Internal", positionId:1, department:"Engineering", experience:"2 years",
    scores:{"System Design":50,"Programming Proficiency":70,"Code Review & Mentoring":42,"Problem Solving":65,"Communication":58,"Agile/Scrum":60},
    quizHistory:[], devPlan:null, certifications:null, selfGapChecks:[],
    progressLog:[{date:"Jan",score:42},{date:"Feb",score:45},{date:"Mar",score:48},{date:"Apr",score:51},{date:"May",score:56},{date:"Jun",score:58}],
    eq:{self:{selfAwareness:5,selfRegulation:4,empathy:6,relationshipManagement:4,motivation:7},manager:{selfAwareness:4,selfRegulation:3,empathy:5,relationshipManagement:3,motivation:6},history:[{date:"Jan 2026",overall:5.0},{date:"Feb 2026",overall:5.2},{date:"Mar 2026",overall:5.4}],simulations:[],matchedMentorId:null,matchScore:0}},
];

const SEED_MENTORS = [
  { id:201, name:"Arjun Sharma", email:"arjun@mentor.com", password:"arjun123", role:"mentor", title:"Engineering Director", company:"TechCorp", experience:"14 years",
    bio:"I've led engineering teams of 50+ across 3 continents. I specialise in helping engineers develop the confidence and presence they need to step into leadership.",
    strengthTags:["Conflict Navigator","Executive Presence Coach","Resilience Driver"],
    strengthScores:{selfAwareness:9,selfRegulation:9,empathy:7,relationshipManagement:9,motivation:8},
    matchedMenteeIds:[], sessions:[], effectivenessRating:null},
  { id:202, name:"Leila Hassan", email:"leila@mentor.com", password:"leila123", role:"mentor", title:"Chief People Officer", company:"ScaleUp Inc.", experience:"18 years",
    bio:"I've built people functions from scratch at three startups. My passion is helping individuals understand their emotional patterns before those patterns hold them back.",
    strengthTags:["Self-Awareness Champion","Empathy Builder","Conflict Navigator"],
    strengthScores:{selfAwareness:10,selfRegulation:8,empathy:10,relationshipManagement:8,motivation:7},
    matchedMenteeIds:[], sessions:[], effectivenessRating:null},
];


const SEED_NOTIFICATIONS = [
  { id:1, to:"hr", from:"priya@company.com", title:"Self Gap Check Completed", body:"Priya Nair completed a self-initiated skill gap check for Senior Software Engineer.", time:"2h ago", read:false },
  { id:2, to:"priya@company.com", from:"hr", title:"Development Plan Ready", body:"Your HR has generated a development plan for your role. Check it out!", time:"1d ago", read:false },
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function calcFit(emp, pos) {
  if (!pos) return 0;
  let total=0,count=0;
  pos.criteria.forEach(c=>{
    const a=emp.scores?.[c.skill]||0;
    const w=c.weight==="Critical"?3:c.weight==="High"?2:1;
    total+=(Math.min(a/c.required,1))*w; count+=w;
  });
  return count?Math.round((total/count)*100):0;
}
function fitColor(s){return s>=80?"var(--green)":s>=60?"var(--amber)":"var(--red)";}
function fitTag(s){return s>=80?"t-green":s>=60?"t-amber":"t-red";}
function fitLabel(s){return s>=85?"Excellent Fit":s>=70?"Good Fit":s>=55?"Partial Fit":"Gap Present";}
function initials(n){return n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);}
function avatarBg(n){const c=["#0f1f3d","#1a3f8f","#5a2d8f","#c9a84c","#1a6e42","#b86e00"];return c[n.charCodeAt(0)%c.length];}

/* ─── PERSISTENCE ────────────────────────────────────────────────────────── */
function loadState(key, fallback) {
  try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; }
}
function saveState(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ════════════ MAIN APP ════════════════════════════════════════════════════ */
export default function TalentIQ() {
  const [session, setSession] = useState(()=>loadState("tiq_session",null));
  const [positions, setPositions] = useState(()=>loadState("tiq_positions",SEED_POSITIONS));
  const [employees, setEmployees] = useState(()=>loadState("tiq_employees",SEED_EMPLOYEES));
  const [mentors, setMentors] = useState(()=>loadState("tiq_mentors",SEED_MENTORS));
  const [notifications, setNotifications] = useState(()=>loadState("tiq_notifications",SEED_NOTIFICATIONS));
  const [toast, setToast] = useState(null);

  useEffect(()=>saveState("tiq_session",session),[session]);
  useEffect(()=>saveState("tiq_positions",positions),[positions]);
  useEffect(()=>saveState("tiq_employees",employees),[employees]);
  useEffect(()=>saveState("tiq_mentors",mentors),[mentors]);
  useEffect(()=>saveState("tiq_notifications",notifications),[notifications]);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),3000);};
  const logout=()=>{saveState("tiq_session",null);setSession(null);};
  const updateEmployee=(id,patch)=>setEmployees(es=>es.map(e=>e.id===id?{...e,...patch}:e));
  const updateMentor=(id,patch,isNew=false)=>{
    if(isNew) setMentors(ms=>[...ms,patch]);
    else setMentors(ms=>ms.map(m=>m.id===id?{...m,...patch}:m));
  };

  const addNotification=(to,from,title,body)=>{
    const n={id:Date.now(),to,from,title,body,time:"Just now",read:false};
    setNotifications(ns=>[n,...ns]);
  };

  if(!session) return <LoginScreen employees={employees} mentors={mentors} onLogin={s=>{saveState("tiq_session",s);setSession(s);}}/>;

  return (
    <>
      <style>{STYLES}</style>
      {session.role==="hr"
        ? <HRApp session={session} positions={positions} setPositions={setPositions} employees={employees} setEmployees={setEmployees} mentors={mentors} setMentors={setMentors} notifications={notifications} setNotifications={setNotifications} addNotification={addNotification} showToast={showToast} logout={logout} updateEmployee={updateEmployee} updateMentor={updateMentor}/>
        : session.role==="mentor"
        ? <MentorApp session={session} mentors={mentors} employees={employees} updateMentor={updateMentor} updateEmployee={updateEmployee} notifications={notifications} setNotifications={setNotifications} addNotification={addNotification} showToast={showToast} logout={logout}/>
        : <EmployeeApp session={session} positions={positions} employees={employees} mentors={mentors} updateEmployee={updateEmployee} notifications={notifications} setNotifications={setNotifications} addNotification={addNotification} showToast={showToast} logout={logout}/>
      }
      {toast&&<div style={{position:"fixed",bottom:20,right:20,background:"var(--navy)",color:"#fff",padding:"11px 20px",borderRadius:8,fontSize:12,fontWeight:600,zIndex:999,animation:"slideUp 0.2s ease",boxShadow:"0 8px 24px rgba(15,31,61,0.25)",display:"flex",alignItems:"center",gap:8}}><span style={{color:"var(--gold)"}}>✓</span>{toast}</div>}
    </>
  );
}

/* ─── LOGIN ──────────────────────────────────────────────────────────────── */
function LoginScreen({employees,mentors,onLogin}){
  const [role,setRole]=useState("hr");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  function login(){
    setErr("");
    if(role==="hr"){
      if(email==="hr@company.com"&&pw==="hr123") onLogin({role:"hr",user:{name:"HR Admin",email}});
      else setErr("Try: hr@company.com / hr123");
    } else if(role==="mentor"){
      const m=mentors.find(m=>m.email===email&&m.password===pw);
      if(m) onLogin({role:"mentor",user:m});
      else setErr("Try: arjun@mentor.com / arjun123");
    } else {
      const emp=employees.find(e=>e.email===email&&e.password===pw);
      if(emp) onLogin({role:"employee",user:emp});
      else setErr("Invalid credentials. Try: priya@company.com / priya123");
    }
  }
  return(
    <>
      <style>{STYLES}</style>
      <div className="login-wrap">
        <div className="login-left">
          <div className="login-brand"><div className="login-brand-name">Talent<span>IQ</span></div><div className="login-brand-tag">HR Intelligence Platform</div></div>
          <div className="login-hero">
            <h1>Your career,<br/><em>intelligently</em><br/>navigated.</h1>
            <p>AI-powered skill assessment, EQ profiling, mentor matching, and development planning — built for HR, employees, and mentors.</p>
          </div>
          <div className="login-badges">{["EQ Assessment","360° Profiling","Mentor Matching","Skill Gap Analysis","Growth Analytics"].map(b=><div className="login-badge" key={b}>{b}</div>)}</div>
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2>Welcome back</h2>
            <p>Sign in to access your TalentIQ dashboard.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>
              {[{id:"hr",icon:"◈",label:"HR / Admin",sub:"Full platform"},{id:"employee",icon:"◎",label:"Employee",sub:"My dashboard"},{id:"mentor",icon:"⊕",label:"Mentor",sub:"Mentor portal"}].map(r=>(
                <div key={r.id} className={`role-btn ${role===r.id?"selected":""}`} onClick={()=>setRole(r.id)}>
                  <div className="role-btn-icon">{r.icon}</div><div className="role-btn-label">{r.label}</div><div className="role-btn-sub">{r.sub}</div>
                </div>
              ))}
            </div>
            {err&&<div className="alert a-warn" style={{marginBottom:14}}><span>⚠</span>{err}</div>}
            <div className="form-group"><label className="form-lbl">Email</label><input className="form-input" type="email" placeholder={role==="hr"?"hr@company.com":role==="mentor"?"arjun@mentor.com":"priya@company.com"} value={email} onChange={e=>setEmail(e.target.value)}/></div>
            <div className="form-group"><label className="form-lbl">Password</label><input className="form-input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={login}>Sign In →</button>
            <div style={{marginTop:14,padding:12,background:"var(--surface2)",borderRadius:8,fontSize:11,color:"var(--muted)",lineHeight:1.7,border:"1px solid var(--border)"}}>
              <strong style={{color:"var(--navy)"}}>Demo accounts:</strong><br/>
              HR: hr@company.com / hr123<br/>
              Employee: priya@company.com / priya123<br/>
              Mentor: arjun@mentor.com / arjun123
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════ HR APP ══════════════════════════════════════════════════════ */
function HRApp({session,positions,setPositions,employees,setEmployees,mentors,setMentors,notifications,setNotifications,addNotification,showToast,logout,updateEmployee,updateMentor}){
  const [view,setView]=useState("dashboard");
  const [addMentorOpen,setAddMentorOpen]=useState(false);
  const [modal,setModal]=useState(null);
  const [selected,setSelected]=useState(null);
  const unread=notifications.filter(n=>n.to==="hr"&&!n.read).length;
  const open=(t,d=null)=>{setSelected(d);setModal(t);};
  const close=()=>{setModal(null);setSelected(null);};
  const addPos=pos=>{setPositions(p=>[...p,{...pos,id:Date.now()}]);close();showToast("Position created");};
  const updatePos=pos=>{setPositions(ps=>ps.map(p=>p.id===pos.id?pos:p));close();showToast("Position updated");};
  const addEmp=emp=>{setEmployees(e=>[...e,{...emp,id:Date.now(),quizHistory:[],devPlan:null,certifications:null,selfGapChecks:[],progressLog:[],eq:{self:{selfAwareness:0,selfRegulation:0,empathy:0,relationshipManagement:0,motivation:0},manager:{selfAwareness:0,selfRegulation:0,empathy:0,relationshipManagement:0,motivation:0},history:[],simulations:[],matchedMentorId:null,matchScore:0}}]);close();showToast("Employee added");};
  const markAllRead=()=>setNotifications(ns=>ns.map(n=>n.to==="hr"?{...n,read:true}:n));

  const NAV=[
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"positions",icon:"◈",label:"Positions",badge:positions.length},
    {id:"employees",icon:"◎",label:"Employees",badge:employees.length},
    {id:"eq",icon:"◑",label:"EQ Analytics"},
    {id:"mentors",icon:"⊕",label:"Mentor Management"},
    {id:"compare",icon:"⇄",label:"Compare"},
    {id:"team",icon:"⊕",label:"Team Overview"},
    {id:"reports",icon:"↗",label:"Reports"},
    {id:"notifications",icon:"🔔",label:"Notifications",badgeRed:unread},
  ];

  const titles={dashboard:"HR Dashboard",positions:"Positions & Skill Criteria",employees:"Employees & Candidates",eq:"EQ Analytics",mentors:"Mentor Management",compare:"Candidate Comparison",team:"Team Overview",reports:"Reports",notifications:"Notifications"};

  return(
    <div className="app-shell fade-in">
      <aside className="sidebar">
        <div className="logo-wrap"><div className="logo-name">Talent<span>IQ</span></div><div className="logo-role">HR Administrator</div></div>
        <div className="nav-section">
          <div className="nav-section-lbl">Platform</div>
          {NAV.map(n=>(
            <button key={n.id} className={`nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
              {n.badge!==undefined&&<span className="nav-pill">{n.badge}</span>}
              {n.badgeRed>0&&<span className="nav-pill-red">{n.badgeRed}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-foot">
          <div className="s-user">
            <div className="s-avatar" style={{background:"var(--gold)"}}><span style={{color:"var(--navy)"}}>HR</span></div>
            <div><div className="s-name">{session.user.name}</div><div className="s-role">Administrator</div></div>
            <button className="logout-btn" onClick={logout}>⏻</button>
          </div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div><div className="topbar-title">{titles[view]}</div><div className="topbar-sub">TalentIQ HR Platform</div></div>
          <div style={{display:"flex",gap:8}}>
            {view==="positions"&&<button className="btn btn-primary btn-sm" onClick={()=>open("newPos")}>＋ New Position</button>}
            {view==="employees"&&<button className="btn btn-primary btn-sm" onClick={()=>open("newEmp")}>＋ Add Employee</button>}
            {view==="mentors"&&<button className="btn btn-primary btn-sm" onClick={()=>setAddMentorOpen(true)}>＋ Add Mentor</button>}
          </div>
        </div>
        <div className="page fade-in" key={view}>
          {view==="dashboard"&&<HRDashboard positions={positions} employees={employees} open={open} setView={setView}/>}
          {view==="positions"&&<HRPositions positions={positions} employees={employees} open={open}/>}
          {view==="employees"&&<HREmployees employees={employees} positions={positions} open={open}/>}
          {view==="eq"&&<HREQAnalytics employees={employees} mentors={mentors} updateEmployee={updateEmployee} showToast={showToast}/>}
          {view==="mentors"&&<HRMentorManagement employees={employees} mentors={mentors} updateEmployee={updateEmployee} updateMentor={updateMentor} addNotification={addNotification} showToast={showToast} addMentorOpen={addMentorOpen} setAddMentorOpen={setAddMentorOpen}/>}
          {view==="compare"&&<HRCompare employees={employees} positions={positions}/>}
          {view==="team"&&<HRTeam employees={employees} positions={positions}/>}
          {view==="reports"&&<HRReports employees={employees} positions={positions}/>}
          {view==="notifications"&&<HRNotifications notifications={notifications} markAllRead={markAllRead}/>}
        </div>
      </div>
      {modal==="newPos"&&<NewPositionModal onClose={close} onSave={addPos}/>}
      {modal==="editPos"&&selected&&<NewPositionModal onClose={close} onSave={updatePos} existing={selected}/>}
      {modal==="newEmp"&&<NewEmployeeModal onClose={close} onSave={addEmp} positions={positions}/>}
      {modal==="viewEmp"&&selected&&<HREmployeeDetail employee={selected} positions={positions} onClose={close} updateEmployee={updateEmployee} addNotification={addNotification} showToast={showToast}/>}
      {modal==="viewPos"&&selected&&<PositionDetailModal position={selected} employees={employees} onClose={close} onEdit={()=>{close();open("editPos",selected);}}/>}
    </div>
  );
}

/* ─── HR DASHBOARD ───────────────────────────────────────────────────────── */
function HRDashboard({positions,employees,open,setView}){
  const avgFit=employees.length?Math.round(employees.reduce((s,e)=>s+calcFit(e,positions.find(p=>p.id===e.positionId)),0)/employees.length):0;
  const highFit=employees.filter(e=>calcFit(e,positions.find(p=>p.id===e.positionId))>=80).length;
  const selfChecks=employees.reduce((s,e)=>s+(e.selfGapChecks?.length||0),0);
  return(
    <div>
      <div className="stat-grid">
        {[
          {lbl:"Total Employees",val:employees.length,note:"Internal & external",color:"var(--navy)"},
          {lbl:"Positions",val:positions.length,note:"Active benchmarks",color:"var(--gold)"},
          {lbl:"Avg Fit Score",val:`${avgFit}%`,note:avgFit>=70?"Above threshold":"Needs attention",color:fitColor(avgFit)},
          {lbl:"Self Gap Checks",val:selfChecks,note:"Employee initiated",color:"var(--purple)"},
        ].map(s=>(
          <div className="stat-card" key={s.lbl}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:s.color,borderRadius:"10px 0 0 10px"}}/>
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-val" style={{color:s.color}}>{s.val}</div>
            <div className="stat-note">{s.note}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Recent Employees</div><button className="btn btn-ghost btn-sm" onClick={()=>setView("employees")}>All →</button></div>
          {employees.slice(0,4).map(e=>{
            const p=positions.find(x=>x.id===e.positionId);const fit=calcFit(e,p);
            return <div key={e.id} onClick={()=>open("viewEmp",e)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background 0.1s"}}
              onMouseOver={ev=>ev.currentTarget.style.background="var(--surface2)"} onMouseOut={ev=>ev.currentTarget.style.background=""}>
              <div className="s-avatar" style={{background:avatarBg(e.name),width:34,height:34,borderRadius:8,fontSize:11}}>{initials(e.name)}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:avatarBg(e.name)==="var(--navy)"||true?undefined:undefined}}>{e.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p?.title||"—"}</div></div>
              <span className={`tag ${fitTag(fit)}`}>{fit}%</span>
            </div>;
          })}
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Skill Coverage — {positions[0]?.title}</div></div>
          <div className="card-body" style={{paddingTop:4}}>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={positions[0]?.criteria.map(c=>({subject:c.skill.split(" ").slice(0,2).join(" "),Required:c.required,Avg:Math.round(employees.filter(e=>e.positionId===1).reduce((s,e)=>s+(e.scores?.[c.skill]||0),0)/Math.max(1,employees.filter(e=>e.positionId===1).length))}))}>
                <PolarGrid stroke="var(--border)"/><PolarAngleAxis dataKey="subject" tick={{fill:"var(--muted)",fontSize:10,fontFamily:"Epilogue"}}/>
                <Radar name="Required" dataKey="Required" stroke="var(--border2)" fill="var(--border2)" fillOpacity={0.25}/>
                <Radar name="Avg" dataKey="Avg" stroke="var(--navy)" fill="var(--navy)" fillOpacity={0.15} strokeWidth={2}/>
                <Tooltip contentStyle={{fontFamily:"Epilogue",fontSize:11,borderRadius:6,border:"1px solid var(--border)"}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HR POSITIONS ───────────────────────────────────────────────────────── */
function HRPositions({positions,employees,open}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {positions.map(pos=>{
        const pc=employees.filter(e=>e.positionId===pos.id);
        const avg=pc.length?Math.round(pc.reduce((s,e)=>s+calcFit(e,pos),0)/pc.length):0;
        return(
          <div className="card" key={pos.id}>
            <div className="card-hd">
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:"Syne",fontSize:14,fontWeight:700,color:"var(--navy)"}}>{pos.title}</span>
                  <span className="tag t-blue">{pos.department}</span>
                  <span className="tag t-gray">{pos.level}</span>
                </div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{pos.criteria.length} criteria · {pc.length} employees · Avg fit: <strong style={{color:fitColor(avg)}}>{avg||"—"}{avg?"%":""}</strong></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>open("editPos",pos)}>✎ Edit</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>open("viewPos",pos)}>Details →</button>
              </div>
            </div>
            {pos.jdText&&<div style={{padding:"10px 20px",background:"var(--navy-light)",borderBottom:"1px solid var(--border)",fontSize:12,color:"var(--navy)",borderLeft:"3px solid var(--navy)"}}>📄 {pos.jdText.slice(0,120)}…</div>}
            <div className="card-body">
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {pos.criteria.map(c=>(
                  <div key={c.skill} style={{display:"flex",alignItems:"center",gap:6,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:20,padding:"5px 12px"}}>
                    <span style={{fontSize:11,fontWeight:500}}>{c.skill}</span>
                    <span className={`tag ${WC[c.weight]}`} style={{fontSize:9}}>{c.weight}</span>
                    <span style={{fontSize:11,color:"var(--navy)",fontWeight:700}}>{c.required}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── HR EMPLOYEES ───────────────────────────────────────────────────────── */
function HREmployees({employees,positions,open}){
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?employees:employees.filter(e=>e.type===filter);
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["All","Internal","External"].map(f=><button key={f} className={`btn ${filter===f?"btn-primary":"btn-ghost"} btn-sm`} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>
      <div className="card">
        <table><thead><tr><th>Employee</th><th>Type</th><th>Position</th><th>Fit Score</th><th>Status</th><th>Dev Plan</th><th>Self Checks</th><th></th></tr></thead>
          <tbody>{filtered.map(e=>{
            const p=positions.find(x=>x.id===e.positionId);const fit=calcFit(e,p);
            return <tr key={e.id} style={{cursor:"pointer"}} onClick={()=>open("viewEmp",e)}>
              <td><div style={{display:"flex",alignItems:"center",gap:9}}>
                <div className="s-avatar" style={{background:avatarBg(e.name),width:32,height:32,borderRadius:7,fontSize:11}}>{initials(e.name)}</div>
                <div><div style={{fontWeight:600,fontSize:12}}>{e.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{e.role}</div></div>
              </div></td>
              <td><span className={`tag ${e.type==="Internal"?"t-teal":"t-blue"}`}>{e.type}</span></td>
              <td style={{fontSize:11,color:"var(--muted)"}}>{p?.title||"—"}</td>
              <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{flex:1,maxWidth:70}}><div className="prog"><div className="prog-fill" style={{width:`${fit}%`,background:fitColor(fit)}}/></div></div>
                <span style={{fontSize:11,fontWeight:700,color:fitColor(fit)}}>{fit}%</span>
              </div></td>
              <td><span className={`tag ${fitTag(fit)}`}>{fitLabel(fit)}</span></td>
              <td><span className={`tag ${e.devPlan?"t-green":"t-gray"}`}>{e.devPlan?"Ready":"Pending"}</span></td>
              <td><span className={`tag ${e.selfGapChecks?.length?"t-purple":"t-gray"}`}>{e.selfGapChecks?.length||0}</span></td>
              <td onClick={ev=>ev.stopPropagation()}><button className="btn btn-ghost btn-xs" onClick={()=>open("viewEmp",e)}>Details</button></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── HR COMPARE ─────────────────────────────────────────────────────────── */
function HRCompare({employees,positions}){
  const [a,setA]=useState("");const [b,setB]=useState("");
  const empA=employees.find(e=>e.id===Number(a));
  const empB=employees.find(e=>e.id===Number(b));
  const pos=positions.find(p=>p.id===empA?.positionId)||positions.find(p=>p.id===empB?.positionId);
  const allSkills=pos?.criteria.map(c=>c.skill)||[];
  return(
    <div>
      <div className="alert a-info" style={{marginBottom:20}}><span>ℹ</span>Select two candidates assessed for the same position to compare their skill profiles side by side.</div>
      <div className="form-row" style={{marginBottom:20}}>
        <div className="form-group"><label className="form-lbl">Candidate A</label>
          <select className="form-select" value={a} onChange={e=>setA(e.target.value)}>
            <option value="">Select candidate</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-lbl">Candidate B</label>
          <select className="form-select" value={b} onChange={e=>setB(e.target.value)}>
            <option value="">Select candidate</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>
      {empA&&empB&&pos&&(
        <div>
          <div className="compare-grid">
            {[empA,empB].map(emp=>{
              const fit=calcFit(emp,pos);
              return(
                <div key={emp.id}>
                  <div className="compare-header">
                    <div className="s-avatar" style={{background:avatarBg(emp.name),width:44,height:44,borderRadius:10,fontSize:14,margin:"0 auto 8px"}}>{initials(emp.name)}</div>
                    <div className="compare-name">{emp.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{emp.role}</div>
                    <div className="compare-score" style={{color:fitColor(fit)}}>{fit}%</div>
                    <span className={`tag ${fitTag(fit)}`}>{fitLabel(fit)}</span>
                  </div>
                  {allSkills.map(skill=>{
                    const v=emp.scores?.[skill]||0;const req=pos.criteria.find(c=>c.skill===skill)?.required||0;
                    return(
                      <div className="compare-bar-row" key={skill}>
                        <div className="compare-bar-label">{skill.split(" ").slice(0,2).join(" ")}</div>
                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{width:`${v}%`,background:v>=req?"var(--green)":v>=req*0.75?"var(--amber)":"var(--red)"}}/></div>
                        <span style={{fontSize:11,fontWeight:700,color:v>=req?"var(--green)":"var(--red)",minWidth:30,textAlign:"right"}}>{v}%</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="card" style={{marginTop:16}}>
            <div className="card-body" style={{textAlign:"center"}}>
              {calcFit(empA,pos)>calcFit(empB,pos)
                ? <div><span style={{fontSize:20}}>🏆</span> <strong>{empA.name}</strong> is the stronger candidate with <strong style={{color:"var(--green)"}}>{calcFit(empA,pos)}%</strong> vs {empB.name}'s {calcFit(empB,pos)}%</div>
                : calcFit(empB,pos)>calcFit(empA,pos)
                ? <div><span style={{fontSize:20}}>🏆</span> <strong>{empB.name}</strong> is the stronger candidate with <strong style={{color:"var(--green)"}}>{calcFit(empB,pos)}%</strong> vs {empA.name}'s {calcFit(empA,pos)}%</div>
                : <div>Both candidates are equally matched at {calcFit(empA,pos)}%</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HR TEAM ────────────────────────────────────────────────────────────── */
function HRTeam({employees,positions}){
  const internal=employees.filter(e=>e.type==="Internal");
  const allSkills=[...new Set(employees.flatMap(e=>Object.keys(e.scores||{})))];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Team Skill Averages</div></div>
          <div className="card-body">
            {allSkills.slice(0,8).map(skill=>{
              const vals=internal.filter(e=>e.scores?.[skill]!==undefined).map(e=>e.scores[skill]);
              const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
              return <div className="gap-row" key={skill}>
                <div className="gap-row-hd"><span style={{fontSize:12,fontWeight:500}}>{skill}</span><span style={{fontSize:11,fontWeight:700,color:fitColor(avg)}}>{avg}%</span></div>
                <div className="prog"><div className="prog-fill" style={{width:`${avg}%`,background:fitColor(avg)}}/></div>
              </div>;
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Employee Fit</div></div>
          <div className="card-body" style={{paddingTop:4}}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={internal.map(e=>({name:e.name.split(" ")[0],fit:calcFit(e,positions.find(p=>p.id===e.positionId))}))}>
                <XAxis dataKey="name" tick={{fontSize:11}}/><YAxis domain={[0,100]} tick={{fontSize:10}}/>
                <Tooltip contentStyle={{fontFamily:"Epilogue",fontSize:11,borderRadius:6,border:"1px solid var(--border)"}}/>
                <Bar dataKey="fit" radius={[4,4,0,0]}>
                  {internal.map((e,i)=><Cell key={i} fill={calcFit(e,positions.find(p=>p.id===e.positionId))>=80?"var(--green)":calcFit(e,positions.find(p=>p.id===e.positionId))>=60?"var(--gold)":"var(--red)"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hd"><div className="card-title">Skill Matrix</div></div>
        <div style={{overflowX:"auto"}}>
          <table style={{minWidth:500}}>
            <thead><tr><th>Employee</th>{allSkills.slice(0,6).map(s=><th key={s} style={{fontSize:10}}>{s.split(" ").slice(0,2).join(" ")}</th>)}</tr></thead>
            <tbody>{internal.map(e=>(
              <tr key={e.id}>
                <td style={{fontWeight:600,fontSize:12}}>{e.name}</td>
                {allSkills.slice(0,6).map(s=>{const v=e.scores?.[s];
                  return v===undefined?<td key={s} style={{color:"var(--muted)"}}>—</td>:
                  <td key={s}><div style={{background:fitColor(v)+"22",color:fitColor(v),fontWeight:700,fontSize:11,padding:"2px 9px",borderRadius:20,display:"inline-block"}}>{v}%</div></td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── HR REPORTS ─────────────────────────────────────────────────────────── */
function HRReports({employees,positions}){
  const fitDist=[
    {lbl:"Excellent (85–100%)",count:employees.filter(e=>calcFit(e,positions.find(p=>p.id===e.positionId))>=85).length,color:"var(--green)"},
    {lbl:"Good (70–84%)",count:employees.filter(e=>{const f=calcFit(e,positions.find(p=>p.id===e.positionId));return f>=70&&f<85;}).length,color:"var(--navy)"},
    {lbl:"Partial (55–69%)",count:employees.filter(e=>{const f=calcFit(e,positions.find(p=>p.id===e.positionId));return f>=55&&f<70;}).length,color:"var(--amber)"},
    {lbl:"Gap (<55%)",count:employees.filter(e=>calcFit(e,positions.find(p=>p.id===e.positionId))<55).length,color:"var(--red)"},
  ];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card"><div className="card-hd"><div className="card-title">Fit Distribution</div></div>
          <div className="card-body">{fitDist.map(d=>(
            <div key={d.lbl} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{flex:1}}><div style={{fontSize:12,marginBottom:5,color:"var(--ink2)"}}>{d.lbl}</div>
                <div className="prog"><div style={{height:"100%",width:`${Math.round(d.count/Math.max(1,employees.length)*100)}%`,background:d.color,borderRadius:3}}/></div>
              </div>
              <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:d.color,minWidth:22}}>{d.count}</div>
            </div>
          ))}</div>
        </div>
        <div className="card"><div className="card-hd"><div className="card-title">Self Gap Checks</div></div>
          <div className="card-body">
            {employees.filter(e=>e.selfGapChecks?.length).map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,fontWeight:600}}>{e.name}</span>
                <span className="tag t-purple">{e.selfGapChecks.length} check{e.selfGapChecks.length>1?"s":""}</span>
              </div>
            ))}
            {!employees.some(e=>e.selfGapChecks?.length)&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"20px 0"}}>No self-gap checks yet</div>}
          </div>
        </div>
      </div>
      <div className="card"><div className="card-hd"><div className="card-title">Full Report</div></div>
        <table><thead><tr><th>Name</th><th>Type</th><th>Position</th><th>Fit</th><th>Status</th><th>Dev Plan</th><th>Self Checks</th><th>Assessments</th></tr></thead>
          <tbody>{employees.map(e=>{const p=positions.find(x=>x.id===e.positionId);const fit=calcFit(e,p);
            return <tr key={e.id}>
              <td style={{fontWeight:600}}>{e.name}</td>
              <td><span className={`tag ${e.type==="Internal"?"t-teal":"t-blue"}`}>{e.type}</span></td>
              <td style={{fontSize:11,color:"var(--muted)"}}>{p?.title||"—"}</td>
              <td><span style={{fontWeight:700,color:fitColor(fit)}}>{fit}%</span></td>
              <td><span className={`tag ${fitTag(fit)}`}>{fitLabel(fit)}</span></td>
              <td><span className={`tag ${e.devPlan?"t-green":"t-gray"}`}>{e.devPlan?"Ready":"Pending"}</span></td>
              <td><span className={`tag ${e.selfGapChecks?.length?"t-purple":"t-gray"}`}>{e.selfGapChecks?.length||0}</span></td>
              <td><span className={`tag ${e.quizHistory?.length?"t-blue":"t-gray"}`}>{e.quizHistory?.length||0}</span></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── HR EQ ANALYTICS ────────────────────────────────────────────────────── */
function HREQAnalytics({employees,mentors,updateEmployee,showToast}){
  const [selectedEmp,setSelectedEmp]=useState(null);
  const [mgrScores,setMgrScores]=useState({selfAwareness:5,selfRegulation:5,empathy:5,relationshipManagement:5,motivation:5});
  const [saving,setSaving]=useState(false);

  function openRate(emp){
    setSelectedEmp(emp);
    setMgrScores(emp.eq?.manager||{selfAwareness:5,selfRegulation:5,empathy:5,relationshipManagement:5,motivation:5});
  }

  function saveManagerScores(){
    setSaving(true);
    const newEq={...(selectedEmp.eq||{}),manager:mgrScores,history:[...(selectedEmp.eq?.history||[]),{date:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}),overall:Math.round(Object.values(mgrScores).reduce((a,b)=>a+b,0)/5*10)/10}]};
    updateEmployee(selectedEmp.id,{eq:newEq});
    setSaving(false);setSelectedEmp(null);showToast("Manager EQ scores saved");
  }

  function calcOverall(scores){return scores?Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/5*10)/10:0;}
  function eqColor(v){return v>=8?"var(--green)":v>=6?"var(--gold)":v>=4?"var(--amber)":"var(--red)";}

  return(
    <div>
      <div className="alert a-info" style={{marginBottom:20}}><span>◑</span>Rate employees on each EQ dimension as their manager. Employees rate themselves — the 360° gap reveals blind spots neither party can see alone.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Team EQ Overview</div></div>
          <div className="card-body">
            {EQ_DIMS.map(dim=>{
              const vals=employees.map(e=>e.eq?.self?.[dim.key]||0).filter(v=>v>0);
              const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10:0;
              const mgrVals=employees.map(e=>e.eq?.manager?.[dim.key]||0).filter(v=>v>0);
              const mgrAvg=mgrVals.length?Math.round(mgrVals.reduce((a,b)=>a+b,0)/mgrVals.length*10)/10:0;
              return(
                <div key={dim.key} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600}}>{dim.label}</span>
                    <div style={{display:"flex",gap:10}}>
                      <span style={{fontSize:11,color:"var(--navy)",fontWeight:700}}>Self: {avg||"—"}</span>
                      <span style={{fontSize:11,color:"#8a6d1f",fontWeight:700}}>Mgr: {mgrAvg||"—"}</span>
                    </div>
                  </div>
                  <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:3}}>
                    <div style={{height:"100%",width:`${avg*10}%`,background:"var(--navy)",borderRadius:3}}/>
                  </div>
                  <div style={{height:4,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${mgrAvg*10}%`,background:"var(--gold)",borderRadius:3}}/>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",gap:14,marginTop:8,fontSize:11}}>
              <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:"var(--navy)",borderRadius:2,display:"inline-block"}}/> Self-rated</span>
              <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:"var(--gold)",borderRadius:2,display:"inline-block"}}/> Manager-rated</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">360° Gap Flags</div></div>
          <div className="card-body">
            {employees.map(emp=>{
              const self=emp.eq?.self;const mgr=emp.eq?.manager;
              if(!self||!mgr) return null;
              const gaps=EQ_DIMS.map(d=>({label:d.label,gap:Math.abs((self[d.key]||0)-(mgr[d.key]||0))})).filter(g=>g.gap>=3);
              if(!gaps.length) return(
                <div key={emp.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:12,fontWeight:600}}>{emp.name}</span><span className="tag t-green">Aligned</span>
                </div>
              );
              return(
                <div key={emp.id} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600}}>{emp.name}</span><span className="tag t-amber">{gaps.length} gap{gaps.length>1?"s":""}</span>
                  </div>
                  {gaps.map(g=><div key={g.label} style={{fontSize:11,color:"var(--amber)",marginLeft:8}}>⚠ {g.label}: {g.gap} point gap</div>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd"><div className="card-title">Rate Employee EQ (Manager View)</div></div>
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {employees.map(emp=>{
              const overall=calcOverall(emp.eq?.manager);
              return(
                <div key={emp.id} style={{border:"1px solid var(--border)",borderRadius:9,padding:14,background:"var(--surface)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",gap:9,alignItems:"center"}}>
                      <div className="s-avatar" style={{background:avatarBg(emp.name),width:32,height:32,borderRadius:7,fontSize:11}}>{initials(emp.name)}</div>
                      <div><div style={{fontSize:12,fontWeight:600}}>{emp.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{emp.role}</div></div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:overall?eqColor(overall):"var(--muted)"}}>{overall||"—"}</div>
                      <div style={{fontSize:9,color:"var(--muted)"}}>MGR EQ</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>openRate(emp)}>◑ Rate EQ</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedEmp&&(
        <div className="modal-overlay"><div className="modal">
          <div className="modal-hd"><div className="modal-title">Manager EQ Rating — {selectedEmp.name}</div><button className="modal-x" onClick={()=>setSelectedEmp(null)}>×</button></div>
          <div className="modal-body">
            <div className="alert a-info" style={{marginBottom:16}}><span>ℹ</span>Rate from 1 (significant gap) to 10 (exceptional strength). Be honest — this creates the 360° view the mentoring system needs.</div>
            {EQ_DIMS.map(dim=>(
              <div key={dim.key} className="eq-slider-wrap">
                <div className="eq-slider-hd"><span className="eq-slider-label">{dim.label}</span><span className="eq-slider-val">{mgrScores[dim.key]}/10</span></div>
                <input type="range" min={1} max={10} value={mgrScores[dim.key]} className="eq-slider" onChange={e=>setMgrScores(s=>({...s,[dim.key]:Number(e.target.value)}))}/>
                <div className="eq-dim-desc">{dim.desc}</div>
              </div>
            ))}
          </div>
          <div className="modal-ft"><button className="btn btn-ghost" onClick={()=>setSelectedEmp(null)}>Cancel</button><button className="btn btn-primary" onClick={saveManagerScores} disabled={saving}>Save Ratings</button></div>
        </div></div>
      )}
    </div>
  );
}

/* ─── HR MENTOR MANAGEMENT ───────────────────────────────────────────────── */
function HRMentorManagement({employees,mentors,updateEmployee,updateMentor,addNotification,showToast,addMentorOpen,setAddMentorOpen}){
  const [selectedEmp,setSelectedEmp]=useState(null);
  const [newMentor,setNewMentor]=useState({name:"",email:"",password:"",title:"",company:"",experience:"",bio:"",strengthTags:[],strengthScores:{selfAwareness:7,selfRegulation:7,empathy:7,relationshipManagement:7,motivation:7}});
  const ALL_TAGS=["Self-Awareness Champion","Conflict Navigator","Empathy Builder","Executive Presence Coach","Resilience Driver"];

  function toggleTag(tag){
    setNewMentor(m=>({...m,strengthTags:m.strengthTags.includes(tag)?m.strengthTags.filter(t=>t!==tag):[...m.strengthTags,tag]}));
  }

  function saveMentor(){
    if(!newMentor.name||!newMentor.email||!newMentor.password){showToast("Name, email and password required");return;}
    const mentor={...newMentor,id:Date.now(),role:"mentor",matchedMenteeIds:[],sessions:[],effectivenessRating:null};
    updateMentor(null,mentor,true);
    showToast(`${newMentor.name} added as mentor!`);
    setAddMentorOpen(false);
    setNewMentor({name:"",email:"",password:"",title:"",company:"",experience:"",bio:"",strengthTags:[],strengthScores:{selfAwareness:7,selfRegulation:7,empathy:7,relationshipManagement:7,motivation:7}});
  }

  function calcMatchScore(emp,mentor){
    const self=emp.eq?.self||{};const mgr=emp.eq?.manager||{};
    const mStr=mentor.strengthScores||{};
    let eqGapScore=0;
    EQ_DIMS.forEach(d=>{
      const empScore=(self[d.key]||0+mgr[d.key]||0)/2;
      const mentorStr=mStr[d.key]||5;
      const gap=Math.max(0,10-empScore);
      eqGapScore+=gap*(mentorStr/10);
    });
    const simScore=emp.eq?.simulations?.length>0?70:50;
    return Math.min(99,Math.round(eqGapScore*6+simScore*0.4));
  }

  function matchMentee(emp,mentor){
    const score=calcMatchScore(emp,mentor);
    updateEmployee(emp.id,{eq:{...emp.eq,matchedMentorId:mentor.id,matchScore:score}});
    updateMentor(mentor.id,{matchedMenteeIds:[...(mentor.matchedMenteeIds||[]),emp.id]});
    addNotification(emp.email,"hr","Mentor Match Found",`You've been matched with ${mentor.name} — your EQ-based mentor. Check your Mentor tab to view your match.`);
    addNotification(mentor.email,"hr","New Mentee Match",`You've been matched with ${emp.name}. Log in to your Mentor Portal to view their profile and accept or pass.`);
    showToast(`${emp.name} matched with ${mentor.name}`);
    setSelectedEmp(null);
  }

  function unmatch(emp){
    const mId=emp.eq?.matchedMentorId;
    if(mId){const m=mentors.find(x=>x.id===mId);if(m)updateMentor(mId,{matchedMenteeIds:(m.matchedMenteeIds||[]).filter(id=>id!==emp.id)});}
    updateEmployee(emp.id,{eq:{...emp.eq,matchedMentorId:null,matchScore:0}});
    showToast("Match removed");
  }

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Available Mentors</div></div>
          <div className="card-body">
            {mentors.map(m=>(
              <div key={m.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div className="s-avatar" style={{background:avatarBg(m.name),width:36,height:36,borderRadius:8,fontSize:12}}>{initials(m.name)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{m.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>{m.title} · {m.company}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {m.strengthTags.map(t=><span key={t} className="mentor-tag">{t}</span>)}
                    </div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"Syne",fontSize:16,fontWeight:800,color:"var(--navy)"}}>{(m.matchedMenteeIds||[]).length}</div>
                    <div style={{fontSize:9,color:"var(--muted)"}}>MENTEES</div>
                  </div>
                </div>
                <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
                  {EQ_DIMS.map(d=>(
                    <div key={d.key} style={{textAlign:"center",background:"var(--navy-light)",borderRadius:5,padding:"4px 2px"}}>
                      <div style={{fontFamily:"Syne",fontSize:13,fontWeight:800,color:"var(--navy)"}}>{m.strengthScores?.[d.key]||0}</div>
                      <div style={{fontSize:8,color:"var(--muted)"}}>{d.label.split(" ")[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Employees — Match Status</div></div>
          <div className="card-body">
            {employees.map(emp=>{
              const matched=mentors.find(m=>m.id===emp.eq?.matchedMentorId);
              return(
                <div key={emp.id} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:matched?6:0}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div className="s-avatar" style={{background:avatarBg(emp.name),width:28,height:28,borderRadius:6,fontSize:10}}>{initials(emp.name)}</div>
                      <div><div style={{fontSize:12,fontWeight:600}}>{emp.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{emp.role}</div></div>
                    </div>
                    {matched
                      ?<div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span className="tag t-green">Matched</span>
                        <button className="btn btn-danger btn-xs" onClick={()=>unmatch(emp)}>Remove</button>
                       </div>
                      :<button className="btn btn-primary btn-xs" onClick={()=>setSelectedEmp(emp)}>Match →</button>
                    }
                  </div>
                  {matched&&<div style={{fontSize:11,color:"var(--muted)",marginLeft:36}}>Mentor: {matched.name} · Score: <strong style={{color:"var(--gold)"}}>{emp.eq?.matchScore}</strong></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedEmp&&(
        <div className="modal-overlay"><div className="modal modal-wide">
          <div className="modal-hd"><div><div className="modal-title">Match a Mentor — {selectedEmp.name}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Ranked by EQ compatibility score</div></div><button className="modal-x" onClick={()=>setSelectedEmp(null)}>×</button></div>
          <div className="modal-body">
            {mentors.map((m,i)=>{
              const score=calcMatchScore(selectedEmp,m);
              const self=selectedEmp.eq?.self||{};const mgr=selectedEmp.eq?.manager||{};
              return(
                <div key={m.id} className={`mentor-match-card ${i===0?"top":""}`} style={{marginBottom:12}}>
                  <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div className="mentor-score-ring"><div className="mentor-score-num">{score}</div><div className="mentor-score-lbl">Match</div></div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontFamily:"Syne",fontSize:15,fontWeight:700,color:"var(--navy)"}}>{m.name} {i===0&&<span className="tag t-gold" style={{fontSize:9,marginLeft:4}}>Best Match</span>}</div>
                          <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>{m.title} · {m.company}</div>
                          <div>{m.strengthTags.map(t=><span key={t} className="mentor-tag">{t}</span>)}</div>
                        </div>
                        <button className="btn btn-gold btn-sm" onClick={()=>matchMentee(selectedEmp,m)}>Confirm Match</button>
                      </div>
                      <div className="why-matched">
                        <div className="why-matched-title">Why This Match</div>
                        {EQ_DIMS.filter(d=>{const s=(self[d.key]||0+mgr[d.key]||0)/2;return s<6&&(m.strengthScores?.[d.key]||0)>=8;}).map(d=>(
                          <div key={d.key} className="why-matched-item"><span style={{color:"var(--gold)"}}>→</span><span><strong>{d.label}:</strong> {selectedEmp.name}'s average is {Math.round(((self[d.key]||0)+(mgr[d.key]||0))/2*10)/10}/10 — {m.name} scores {m.strengthScores?.[d.key]}/10 here.</span></div>
                        ))}
                        {EQ_DIMS.filter(d=>{const s=(self[d.key]||0+mgr[d.key]||0)/2;return s<6&&(m.strengthScores?.[d.key]||0)>=8;}).length===0&&<div className="why-matched-item"><span style={{color:"var(--gold)"}}>→</span><span>Good overall EQ compatibility across dimensions.</span></div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="modal-ft"><button className="btn btn-ghost" onClick={()=>setSelectedEmp(null)}>Cancel</button></div>
        </div></div>
      )}

      {addMentorOpen&&(
        <div className="modal-overlay"><div className="modal">
          <div className="modal-hd"><div className="modal-title">Add New Mentor</div><button className="modal-x" onClick={()=>setAddMentorOpen(false)}>×</button></div>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group"><label className="form-lbl">Full Name *</label><input className="form-input" placeholder="e.g. Arjun Sharma" value={newMentor.name} onChange={e=>setNewMentor(m=>({...m,name:e.target.value}))}/></div>
              <div className="form-group"><label className="form-lbl">Email *</label><input className="form-input" type="email" placeholder="arjun@email.com" value={newMentor.email} onChange={e=>setNewMentor(m=>({...m,email:e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-lbl">Password *</label><input className="form-input" type="text" placeholder="They'll use this to log in" value={newMentor.password} onChange={e=>setNewMentor(m=>({...m,password:e.target.value}))}/></div>
              <div className="form-group"><label className="form-lbl">Job Title</label><input className="form-input" placeholder="e.g. Engineering Director" value={newMentor.title} onChange={e=>setNewMentor(m=>({...m,title:e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-lbl">Company</label><input className="form-input" placeholder="e.g. TechCorp" value={newMentor.company} onChange={e=>setNewMentor(m=>({...m,company:e.target.value}))}/></div>
              <div className="form-group"><label className="form-lbl">Experience</label><input className="form-input" placeholder="e.g. 12 years" value={newMentor.experience} onChange={e=>setNewMentor(m=>({...m,experience:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label className="form-lbl">Bio</label><textarea className="form-textarea" placeholder="A short bio about this mentor's background and focus…" value={newMentor.bio} onChange={e=>setNewMentor(m=>({...m,bio:e.target.value}))} style={{minHeight:70}}/></div>
            <div className="form-group">
              <label className="form-lbl">EQ Strength Tags (select up to 3)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                {ALL_TAGS.map(tag=>(
                  <button key={tag} className={`btn btn-sm ${newMentor.strengthTags.includes(tag)?"btn-primary":"btn-ghost"}`} onClick={()=>toggleTag(tag)} style={{borderRadius:20}}>{tag}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-lbl">EQ Strength Scores (1–10)</label>
              {EQ_DIMS.map(dim=>(
                <div key={dim.key} className="eq-slider-wrap" style={{marginBottom:10}}>
                  <div className="eq-slider-hd"><span className="eq-slider-label" style={{fontSize:12}}>{dim.label}</span><span className="eq-slider-val">{newMentor.strengthScores[dim.key]}/10</span></div>
                  <input type="range" min={1} max={10} value={newMentor.strengthScores[dim.key]} className="eq-slider" onChange={e=>setNewMentor(m=>({...m,strengthScores:{...m.strengthScores,[dim.key]:Number(e.target.value)}}))}/>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-ft">
            <button className="btn btn-ghost" onClick={()=>setAddMentorOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveMentor}>Add Mentor →</button>
          </div>
        </div></div>
      )}
    </div>
  );
}

/* ─── HR NOTIFICATIONS ───────────────────────────────────────────────────── */
function HRNotifications({notifications,markAllRead}){
  const hrNotifs=notifications.filter(n=>n.to==="hr");
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
      </div>
      <div className="card">
        {hrNotifs.length===0?<div className="empty"><div className="empty-icon">🔔</div><div className="empty-title">No notifications</div></div>:
          hrNotifs.map(n=>(
            <div key={n.id} className={`notif-item ${n.read?"":"unread"}`}>
              <div className={`notif-dot ${n.read?"read":""}`}/>
              <div style={{flex:1}}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">{n.body}</div>
                <div className="notif-time">{n.time} · From: {n.from}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ─── NEW POSITION MODAL ─────────────────────────────────────────────────── */
function NewPositionModal({onClose,onSave,existing}){
  const [tab,setTab]=useState("details");
  const [form,setForm]=useState(existing||{title:"",department:"",level:"",type:"Internal & External",jdText:"",description:""});
  const [criteria,setCriteria]=useState(existing?.criteria||[]);
  const [newSkill,setNewSkill]=useState("");const [newReq,setNewReq]=useState(70);const [newW,setNewW]=useState("High");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [jdMode,setJdMode]=useState("paste");
  const fileRef=useRef();

  async function aiSuggest(){
    const text=form.jdText||form.description;
    if(!text){setErr("Add a job description first.");return;}
    setLoading(true);setErr("");
    const r=await askClaude(
      `You are an expert HR consultant. Analyze a job description and extract required skills. Return ONLY valid JSON: {"criteria":[{"skill":"Skill Name","required":75,"weight":"Critical"}]} — 6-8 criteria, weight must be Critical/High/Medium/Low, scores 40-95. No markdown.`,
      `Position: ${form.title}, Department: ${form.department}\nJob Description:\n${text}`
    );
    setLoading(false);
    if(r?.criteria){setCriteria(r.criteria);setErr("");}else setErr("AI extraction failed. Add criteria manually.");
  }

  function handleFile(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{setForm(f=>({...f,jdText:ev.target.result.slice(0,3000)}));};
    reader.readAsText(file);
  }

  function addSkill(){if(!newSkill.trim())return;setCriteria(c=>[...c,{skill:newSkill.trim(),required:Number(newReq),weight:newW}]);setNewSkill("");setNewReq(70);setNewW("High");}

  function save(){
    if(!form.title||!form.department||!form.level){setErr("Fill all required fields.");setTab("details");return;}
    if(criteria.length===0){setErr("Add at least one skill criterion.");setTab("criteria");return;}
    onSave({...form,criteria,id:existing?.id});
  }

  return(
    <div className="modal-overlay"><div className="modal">
      <div className="modal-hd"><div className="modal-title">{existing?"Edit Position":"Create New Position"}</div><button className="modal-x" onClick={onClose}>×</button></div>
      <div className="modal-body">
        <div className="tabs">{["details","jd","criteria"].map(t=><button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t==="details"?"1. Details":t==="jd"?"2. Job Description":"3. Skills"}</button>)}</div>
        {err&&<div className="alert a-warn">{err}</div>}
        {tab==="details"&&<>
          <div className="form-group"><label className="form-lbl">Job Title *</label><input className="form-input" placeholder="e.g. Senior Product Manager" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-lbl">Department *</label>
              <select className="form-select" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                <option value="">Select</option>{DEPTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-lbl">Level *</label>
              <select className="form-select" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
                <option value="">Select</option>{LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-lbl">Candidate Type</label>
            <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {["Internal Only","External Only","Internal & External"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </>}
        {tab==="jd"&&<>
          <div className="tabs" style={{marginBottom:16}}>
            <button className={`tab-btn ${jdMode==="paste"?"active":""}`} onClick={()=>setJdMode("paste")}>📝 Paste Text</button>
            <button className={`tab-btn ${jdMode==="upload"?"active":""}`} onClick={()=>setJdMode("upload")}>📁 Upload File</button>
          </div>
          {jdMode==="paste"&&<div className="form-group">
            <label className="form-lbl">Paste Job Description</label>
            <textarea className="form-textarea" style={{minHeight:160}} placeholder="Paste the full job description here. AI will extract required skills automatically..." value={form.jdText} onChange={e=>setForm({...form,jdText:e.target.value})}/>
          </div>}
          {jdMode==="upload"&&<>
            <div className="jd-drop" onClick={()=>fileRef.current.click()}>
              <div className="jd-drop-icon">📄</div>
              <div className="jd-drop-text">Click to upload a file</div>
              <div className="jd-drop-sub">Supports .txt files · PDF paste recommended</div>
              <input ref={fileRef} type="file" accept=".txt,.text" style={{display:"none"}} onChange={handleFile}/>
            </div>
            {form.jdText&&<div className="alert a-success" style={{marginTop:12}}><span>✓</span>File loaded — {form.jdText.length} characters</div>}
          </>}
          {form.jdText&&<div style={{marginTop:12,padding:"10px 14px",background:"var(--navy-light)",borderRadius:7,fontSize:12,color:"var(--navy)",lineHeight:1.6,maxHeight:100,overflow:"auto",border:"1px solid rgba(15,31,61,0.1)"}}>{form.jdText.slice(0,300)}…</div>}
        </>}
        {tab==="criteria"&&<>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:14}} onClick={aiSuggest} disabled={loading}>
            {loading?"⏳ AI is analysing job description…":"✦ Extract Skills from Job Description"}
          </button>
          {criteria.length>0&&<div className="alert a-success"><span>✓</span>{criteria.length} skills extracted. Edit as needed.</div>}
          {criteria.map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:7,padding:"10px 14px",marginBottom:8}}>
              <span style={{flex:1,fontSize:13,fontWeight:500}}>{c.skill}</span>
              <select value={c.weight} onChange={e=>setCriteria(cr=>cr.map((x,j)=>j===i?{...x,weight:e.target.value}:x))} style={{fontSize:11,padding:"4px 8px",border:"1px solid var(--border)",borderRadius:5}}>
                {WEIGHTS.map(w=><option key={w}>{w}</option>)}
              </select>
              <input type="number" min={10} max={100} value={c.required} onChange={e=>setCriteria(cr=>cr.map((x,j)=>j===i?{...x,required:Number(e.target.value)}:x))} style={{width:55,fontSize:12,padding:"4px 8px",border:"1px solid var(--border)",borderRadius:5}}/>
              <span style={{fontSize:11,color:"var(--navy)",fontWeight:700,minWidth:20}}>%</span>
              <button style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:16}} onClick={()=>setCriteria(cr=>cr.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
          <div style={{borderTop:"1px solid var(--border)",paddingTop:14,marginTop:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Add Custom Skill</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8}}>
              <input className="form-input" placeholder="Skill name" value={newSkill} onChange={e=>setNewSkill(e.target.value)} style={{fontSize:12}}/>
              <input type="number" className="form-input" min={10} max={100} value={newReq} onChange={e=>setNewReq(e.target.value)} style={{width:65,fontSize:12}}/>
              <select className="form-select" value={newW} onChange={e=>setNewW(e.target.value)} style={{fontSize:11}}>{WEIGHTS.map(w=><option key={w}>{w}</option>)}</select>
              <button className="btn btn-secondary btn-sm" onClick={addSkill}>Add</button>
            </div>
          </div>
        </>}
      </div>
      <div className="modal-ft">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        {tab==="details"?<button className="btn btn-primary" onClick={()=>setTab("jd")}>Next →</button>
          :tab==="jd"?<button className="btn btn-primary" onClick={()=>setTab("criteria")}>Next →</button>
          :<button className="btn btn-primary" onClick={save}>{existing?"Save Changes":"Create Position"}</button>}
      </div>
    </div></div>
  );
}

/* ─── NEW EMPLOYEE MODAL ─────────────────────────────────────────────────── */
function NewEmployeeModal({onClose,onSave,positions}){
  const [tab,setTab]=useState("profile");
  const [form,setForm]=useState({name:"",role:"",email:"",password:"",type:"Internal",positionId:"",experience:"",department:""});
  const [scores,setScores]=useState({});const [err,setErr]=useState("");
  const selPos=positions.find(p=>p.id===Number(form.positionId));
  useEffect(()=>{if(selPos){const s={};selPos.criteria.forEach(c=>{s[c.skill]=50;});setScores(s);}},[form.positionId]);
  function save(){
    if(!form.name||!form.positionId){setErr("Name and position required.");setTab("profile");return;}
    onSave({...form,positionId:Number(form.positionId),scores});
  }
  return(
    <div className="modal-overlay"><div className="modal">
      <div className="modal-hd"><div className="modal-title">Add Employee / Candidate</div><button className="modal-x" onClick={onClose}>×</button></div>
      <div className="modal-body">
        <div className="tabs">{["profile","assessment"].map(t=><button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t==="profile"?"1. Profile":"2. Assessment"}</button>)}</div>
        {err&&<div className="alert a-warn">{err}</div>}
        {tab==="profile"&&<>
          <div className="form-row">
            <div className="form-group"><label className="form-lbl">Full Name *</label><input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div className="form-group"><label className="form-lbl">Current Role</label><input className="form-input" placeholder="e.g. Junior Developer" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-lbl">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="form-group"><label className="form-lbl">Password</label><input className="form-input" type="password" placeholder="Set login password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-lbl">Type</label>
              <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Internal</option><option>External</option></select>
            </div>
            <div className="form-group"><label className="form-lbl">Experience</label><input className="form-input" placeholder="e.g. 4 years" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})}/></div>
          </div>
          <div className="form-group"><label className="form-lbl">Position *</label>
            <select className="form-select" value={form.positionId} onChange={e=>setForm({...form,positionId:e.target.value})}>
              <option value="">Select position</option>{positions.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </>}
        {tab==="assessment"&&<>
          {!selPos?<div className="alert a-info">Select a position first.</div>:<>
            <div className="alert a-info"><span>ℹ</span>Rate the candidate on each skill for <strong>{selPos.title}</strong>.</div>
            {selPos.criteria.map(c=>(
              <div className="form-group" key={c.skill}>
                <label className="form-lbl" style={{display:"flex",justifyContent:"space-between"}}><span>{c.skill}</span><span style={{color:"var(--navy)",fontWeight:700}}>Required: {c.required}%</span></label>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <input type="range" min={0} max={100} value={scores[c.skill]||0} onChange={e=>setScores(s=>({...s,[c.skill]:Number(e.target.value)}))} style={{flex:1,accentColor:"var(--navy)"}}/>
                  <span style={{fontFamily:"Syne",fontSize:15,fontWeight:800,color:fitColor(scores[c.skill]||0),minWidth:40,textAlign:"right"}}>{scores[c.skill]||0}%</span>
                </div>
              </div>
            ))}
          </>}
        </>}
      </div>
      <div className="modal-ft">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        {tab==="profile"?<button className="btn btn-primary" onClick={()=>setTab("assessment")}>Next →</button>
          :<button className="btn btn-primary" onClick={save}>Save Employee</button>}
      </div>
    </div></div>
  );
}

/* ─── HR EMPLOYEE DETAIL ─────────────────────────────────────────────────── */
function HREmployeeDetail({employee,positions,onClose,updateEmployee,addNotification,showToast}){
  const pos=positions.find(p=>p.id===employee.positionId);
  const fit=calcFit(employee,pos);
  const [loading,setLoading]=useState(false);
  const devPlan=employee.devPlan;

  async function generatePlan(){
    setLoading(true);
    const gaps=pos?.criteria.map(c=>({skill:c.skill,required:c.required,actual:employee.scores?.[c.skill]||0,gap:Math.max(0,c.required-(employee.scores?.[c.skill]||0))})).filter(g=>g.gap>0)||[];
    const r=await askClaude(
      `You are a talent development expert. Return ONLY valid JSON: {"certifications":[{"name":"Name","provider":"Provider","why":"Reason","priority":"High|Medium"}],"phases":[{"title":"Phase","timeline":"Month X","actions":["action"]}]} — 3 certs, 4 phases. Highly specific to their role and gaps. No markdown.`,
      `Employee: ${employee.name}, Role: ${employee.role}, Target: ${pos?.title}, Fit: ${fit}%, Gaps: ${JSON.stringify(gaps)}`
    );
    setLoading(false);
    if(r){
      updateEmployee(employee.id,{devPlan:r});
      addNotification(employee.email,"hr","Development Plan Ready","Your HR has generated a personalised development plan. Check your portal!");
      showToast("Development plan generated & employee notified");
    }
  }

  return(
    <div className="modal-overlay"><div className="modal" style={{maxWidth:700}}>
      <div className="modal-hd">
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div className="s-avatar" style={{background:avatarBg(employee.name),width:38,height:38,borderRadius:8,fontSize:13}}>{initials(employee.name)}</div>
          <div><div className="modal-title">{employee.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{employee.role} · {employee.type}</div></div>
        </div>
        <button className="modal-x" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[{lbl:"Fit Score",val:`${fit}%`,color:fitColor(fit)},{lbl:"Status",val:fitLabel(fit),color:fitColor(fit)},{lbl:"Self Checks",val:employee.selfGapChecks?.length||0,color:"var(--purple)"},{lbl:"Quizzes",val:employee.quizHistory?.length||0,color:"var(--blue)"}].map(s=>(
            <div key={s.lbl} style={{background:"var(--navy-light)",borderRadius:8,padding:"11px 12px",textAlign:"center",border:"1px solid rgba(15,31,61,0.08)"}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>{s.lbl}</div>
              <div style={{fontFamily:"Syne",fontSize:14,fontWeight:800,color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>
        {pos&&<div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Skill Gap Analysis</div>
          {pos.criteria.map(c=>{const actual=employee.scores?.[c.skill]||0;const gap=Math.max(0,c.required-actual);
            return <div className="gap-row" key={c.skill}>
              <div className="gap-row-hd"><span style={{fontSize:12,fontWeight:500}}>{c.skill} <span className={`tag ${WC[c.weight]}`} style={{fontSize:9}}>{c.weight}</span></span>
                <span style={{fontSize:11,color:"var(--muted)"}}>{actual}% / {c.required}% {gap>0&&<span style={{color:"var(--red)",fontWeight:700}}> −{gap}%</span>}</span>
              </div>
              <div className="gap-track"><div className="gap-req" style={{width:`${c.required}%`}}/><div className="gap-act" style={{width:`${actual}%`,background:actual>=c.required?"var(--green)":actual>=c.required*0.75?"var(--amber)":"var(--red)"}}/></div>
            </div>;
          })}
        </div>}
        {employee.selfGapChecks?.length>0&&<div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Employee Self-Gap Checks</div>
          {employee.selfGapChecks.map((g,i)=>(
            <div key={i} style={{background:"var(--gold-light)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600,color:"#7a5f1f"}}>{g.targetRole}</span>
                <span style={{fontSize:10,color:"var(--muted)"}}>{g.date}</span>
              </div>
              <div style={{fontSize:11,color:"var(--muted)"}}>Fit: <strong style={{color:fitColor(g.fit)}}>{g.fit}%</strong> · {g.gaps} gaps identified</div>
            </div>
          ))}
        </div>}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)"}}>Development Plan (linked to gaps)</div>
            <button className="btn btn-primary btn-sm" onClick={generatePlan} disabled={loading}>{loading?"Generating…":"✦ "+(devPlan?"Regenerate":"Generate Plan")}</button>
          </div>
          {loading&&<div style={{display:"flex",gap:12,alignItems:"center",padding:20,justifyContent:"center"}}><div className="spinner"/><div style={{fontSize:13,color:"var(--muted)"}}>Crafting plan based on skill gaps…</div></div>}
          {devPlan&&!loading&&devPlan.phases?.map((ph,i)=>(
            <div className="dev-phase" key={i}>
              <div className="dev-ph-hd"><div className="dev-ph-title">{ph.title}</div><span className="tag t-gold">{ph.timeline}</span></div>
              <div className="dev-ph-body">{ph.actions?.map((a,j)=><div className="dev-action" key={j}><span className="dev-bullet">→</span><span>{a}</span></div>)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="modal-ft"><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
    </div></div>
  );
}

/* ─── POSITION DETAIL MODAL ──────────────────────────────────────────────── */
function PositionDetailModal({position,employees,onClose,onEdit}){
  const pc=employees.filter(e=>e.positionId===position.id);
  return(
    <div className="modal-overlay"><div className="modal">
      <div className="modal-hd">
        <div><div className="modal-title">{position.title}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{position.department} · {position.level}</div></div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>✎ Edit</button>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="modal-body">
        {position.jdText&&<div className="alert a-info" style={{marginBottom:16}}><span>📄</span><div><strong>Job Description:</strong><br/>{position.jdText.slice(0,200)}…</div></div>}
        {position.criteria.map(c=>(
          <div key={c.skill} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,marginBottom:4}}>{c.skill}</div>
              <div className="prog"><div className="prog-fill" style={{width:`${c.required}%`,background:"var(--navy)"}}/></div>
            </div>
            <span className={`tag ${WC[c.weight]}`}>{c.weight}</span>
            <span style={{fontFamily:"Syne",fontSize:15,fontWeight:800,color:"var(--navy)",minWidth:40,textAlign:"right"}}>{c.required}%</span>
          </div>
        ))}
        {pc.length>0&&<div style={{marginTop:20}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Employees in this Role</div>
          {pc.map(e=>{const fit=calcFit(e,position);return(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <div className="s-avatar" style={{background:avatarBg(e.name),width:30,height:30,borderRadius:6,fontSize:10}}>{initials(e.name)}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{e.type}</div></div>
              <span className={`tag ${fitTag(fit)}`}>{fit}%</span>
            </div>
          );})}
        </div>}
      </div>
      <div className="modal-ft"><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
    </div></div>
  );
}

/* ════════════ EMPLOYEE APP ════════════════════════════════════════════════ */
function EmployeeApp({session,positions,employees,mentors,updateEmployee,notifications,setNotifications,addNotification,showToast,logout}){
  const [view,setView]=useState("home");
  const emp=employees.find(e=>e.id===session.user.id)||session.user;
  const pos=positions.find(p=>p.id===emp.positionId);
  const fit=calcFit(emp,pos);
  const unread=notifications.filter(n=>n.to===emp.email&&!n.read).length;
  const markRead=()=>setNotifications(ns=>ns.map(n=>n.to===emp.email?{...n,read:true}:n));
  const matchedMentor=mentors?.find(m=>m.id===emp.eq?.matchedMentorId);

  const NAV=[
    {id:"home",icon:"⊞",label:"My Dashboard"},
    {id:"skills",icon:"◎",label:"My Skills"},
    {id:"quiz",icon:"◈",label:"Self-Assessment"},
    {id:"gap",icon:"⊘",label:"Skill Gap Check"},
    {id:"eq",icon:"◑",label:"EQ Profile"},
    {id:"simulations",icon:"⊛",label:"Simulations"},
    {id:"mentor",icon:"⊕",label:"My Mentor",badge:matchedMentor?1:0},
    {id:"progress",icon:"↗",label:"My Progress"},
    {id:"devplan",icon:"⊕",label:"Development Plan"},
    {id:"notif",icon:"🔔",label:"Notifications",badgeRed:unread},
  ];

  const titles={home:"My Dashboard",skills:"My Skills",quiz:"Self-Assessment",gap:"Skill Gap Check",eq:"My EQ Profile",simulations:"Situational Simulations",mentor:"My Mentor",progress:"My Progress",devplan:"Development Plan",notif:"Notifications"};

  return(
    <div className="app-shell fade-in">
      <aside className="sidebar">
        <div className="logo-wrap"><div className="logo-name">Talent<span>IQ</span></div><div className="logo-role">Employee Portal</div></div>
        <div className="nav-section">
          <div className="nav-section-lbl">My Career</div>
          {NAV.map(n=>(
            <button key={n.id} className={`nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
              {n.badge>0&&<span className="nav-pill">{n.badge}</span>}
              {n.badgeRed>0&&<span className="nav-pill-red">{n.badgeRed}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-foot">
          <div className="s-user">
            <div className="s-avatar" style={{background:avatarBg(emp.name)}}>{initials(emp.name)}</div>
            <div><div className="s-name">{emp.name}</div><div className="s-role">{emp.role}</div></div>
            <button className="logout-btn" onClick={logout}>⏻</button>
          </div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div><div className="topbar-title">{titles[view]}</div><div className="topbar-sub">Your personal career intelligence</div></div>
        </div>
        <div className="page fade-in" key={view}>
          {view==="home"&&<EmpHome emp={emp} pos={pos} fit={fit} setView={setView} unread={unread} matchedMentor={matchedMentor}/>}
          {view==="skills"&&<EmpSkills emp={emp} pos={pos} fit={fit}/>}
          {view==="quiz"&&<EmpQuiz emp={emp} pos={pos} updateEmployee={updateEmployee} showToast={showToast}/>}
          {view==="gap"&&<EmpGapWizard emp={emp} positions={positions} updateEmployee={updateEmployee} addNotification={addNotification} showToast={showToast}/>}
          {view==="eq"&&<EmpEQProfile emp={emp} updateEmployee={updateEmployee} showToast={showToast}/>}
          {view==="simulations"&&<EmpSimulations emp={emp} updateEmployee={updateEmployee} showToast={showToast}/>}
          {view==="mentor"&&<EmpMentor emp={emp} mentor={matchedMentor} notifications={notifications} addNotification={addNotification} showToast={showToast}/>}
          {view==="progress"&&<EmpProgress emp={emp} pos={pos} fit={fit}/>}
          {view==="devplan"&&<EmpDevPlan emp={emp} pos={pos} fit={fit} updateEmployee={updateEmployee} showToast={showToast}/>}
          {view==="notif"&&<EmpNotifications notifications={notifications} email={emp.email} markRead={markRead}/>}
        </div>
      </div>
    </div>
  );
}

/* ─── EMPLOYEE HOME ──────────────────────────────────────────────────────── */
function EmpHome({emp,pos,fit,setView,unread,matchedMentor}){
  const gaps=pos?.criteria.filter(c=>(emp.scores?.[c.skill]||0)<c.required)||[];
  const eqOverall=emp.eq?.self?Math.round(Object.values(emp.eq.self).reduce((a,b)=>a+b,0)/5*10)/10:null;
  return(
    <div>
      <div className="emp-hero">
        <div className="emp-hero-left">
          <div className="emp-hero-greeting">Welcome back</div>
          <div className="emp-hero-name">{emp.name}</div>
          <div className="emp-hero-role">{emp.role} · {emp.department} · {emp.experience}</div>
          <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
            <span className="tag" style={{background:"rgba(201,168,76,0.18)",color:"var(--gold)",borderRadius:20}}>{emp.type}</span>
            {pos&&<span className="tag" style={{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.45)",borderRadius:20}}>{pos.title}</span>}
            {matchedMentor&&<span className="tag" style={{background:"rgba(201,168,76,0.25)",color:"var(--gold)",borderRadius:20}}>⊕ Mentor: {matchedMentor.name}</span>}
            {unread>0&&<span className="tag" style={{background:"rgba(192,57,43,0.25)",color:"#ff9090",borderRadius:20}}>{unread} new notification{unread>1?"s":""}</span>}
          </div>
        </div>
        <div className="emp-hero-right" style={{display:"flex",gap:12}}>
          <div style={{textAlign:"center"}}>
            <div className="emp-score-ring"><div className="emp-score-num">{fit}%</div><div className="emp-score-lbl">Fit Score</div></div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:8}}>{fitLabel(fit)}</div>
          </div>
          {eqOverall&&<div style={{textAlign:"center"}}>
            <div className="emp-score-ring" style={{borderColor:"rgba(201,168,76,0.8)"}}><div className="emp-score-num">{eqOverall}</div><div className="emp-score-lbl">EQ Score</div></div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:8}}>Emotional IQ</div>
          </div>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {val:pos?.criteria.length||0,lbl:"Skills Tracked",color:"var(--navy)"},
          {val:gaps.length,lbl:"Skill Gaps",color:gaps.length>0?"var(--amber)":"var(--green)"},
          {val:emp.eq?.simulations?.length||0,lbl:"Simulations",color:"var(--purple)"},
          {val:matchedMentor?1:0,lbl:"Mentor Match",color:matchedMentor?"var(--gold)":"var(--muted)"},
        ].map(s=>(
          <div key={s.lbl} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",textAlign:"center",boxShadow:"var(--shadow)"}}>
            <div style={{fontFamily:"Syne",fontSize:24,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)"}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Your Top Skills</div><button className="btn btn-ghost btn-sm" onClick={()=>setView("skills")}>See All →</button></div>
          <div className="card-body">
            {pos?.criteria.slice(0,4).map(c=>{const actual=emp.scores?.[c.skill]||0;
              return <div className="gap-row" key={c.skill}>
                <div className="gap-row-hd"><span style={{fontSize:12,fontWeight:500}}>{c.skill}</span><span style={{fontSize:11,fontWeight:700,color:fitColor(actual)}}>{actual}%</span></div>
                <div className="prog"><div className="prog-fill" style={{width:`${actual}%`,background:fitColor(actual)}}/></div>
              </div>;
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Quick Actions</div></div>
          <div className="card-body" style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {icon:"◑",label:"Complete EQ self-assessment",sub:"Rate yourself on 5 EQ dimensions",view:"eq",color:"var(--navy)"},
              {icon:"⊛",label:"Try a situational simulation",sub:"See how you respond under pressure",view:"simulations",color:"var(--purple)"},
              {icon:"⊕",label:matchedMentor?"View your mentor match":"Awaiting mentor match",sub:matchedMentor?`Matched with ${matchedMentor.name}`:"HR will match you soon",view:"mentor",color:"var(--gold)"},
              {icon:"⊘",label:"Check skill gap for next role",sub:"AI-powered gap analysis",view:"gap",color:"var(--green)"},
            ].map(a=>(
              <button key={a.label} onClick={()=>setView(a.view)} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 12px",border:"1px solid var(--border)",borderRadius:8,background:"var(--surface2)",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}
                onMouseOver={e=>e.currentTarget.style.borderColor=a.color} onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{width:32,height:32,borderRadius:7,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:a.color}}>{a.icon}</div>
                <div><div style={{fontSize:12,fontWeight:600}}>{a.label}</div><div style={{fontSize:11,color:"var(--muted)"}}>{a.sub}</div></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMPLOYEE SKILLS ─────────────────────────────────────────────────────── */
function EmpSkills({emp,pos,fit}){
  const radarData=pos?.criteria.map(c=>({subject:c.skill.split(" ").slice(0,2).join(" "),Required:c.required,Mine:emp.scores?.[c.skill]||0}))||[];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card"><div className="card-hd"><div className="card-title">Skills Radar</div></div>
          <div className="card-body" style={{paddingTop:4}}>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)"/><PolarAngleAxis dataKey="subject" tick={{fill:"var(--muted)",fontSize:10,fontFamily:"Epilogue"}}/>
                <Radar name="Required" dataKey="Required" stroke="var(--border2)" fill="var(--border2)" fillOpacity={0.2}/>
                <Radar name="My Score" dataKey="Mine" stroke="var(--navy)" fill="var(--navy)" fillOpacity={0.15} strokeWidth={2}/>
                <Tooltip contentStyle={{fontFamily:"Epilogue",fontSize:11,borderRadius:6,border:"1px solid var(--border)"}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card"><div className="card-hd"><div className="card-title">Skill Breakdown</div><span className={`tag ${fitTag(fit)}`}>{fit}% Overall</span></div>
          <div className="card-body">
            {pos?.criteria.map(c=>{const actual=emp.scores?.[c.skill]||0;const gap=Math.max(0,c.required-actual);
              return <div className="gap-row" key={c.skill}>
                <div className="gap-row-hd"><span style={{fontSize:12,fontWeight:500}}>{c.skill} <span className={`tag ${WC[c.weight]}`} style={{fontSize:9}}>{c.weight}</span></span>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{actual}% / {c.required}% {gap>0&&<span style={{color:"var(--red)",fontWeight:700}}> −{gap}</span>}</span>
                </div>
                <div className="gap-track"><div className="gap-req" style={{width:`${c.required}%`}}/><div className="gap-act" style={{width:`${actual}%`,background:actual>=c.required?"var(--green)":actual>=c.required*0.8?"var(--amber)":"var(--red)"}}/></div>
              </div>;
            })}
          </div>
        </div>
      </div>
      <div className="alert a-info"><span>ℹ</span>Grey bar = required level. Coloured bar = your current level. Red = gap to close.</div>
    </div>
  );
}

/* ─── EMPLOYEE SELF GAP WIZARD ───────────────────────────────────────────── */
function EmpGapWizard({emp,positions,updateEmployee,addNotification,showToast}){
  const [step,setStep]=useState(1);
  const [goalType,setGoalType]=useState("existing");
  const [selectedPos,setSelectedPos]=useState("");
  const [customGoal,setCustomGoal]=useState("");
  const [criteria,setCriteria]=useState([]);
  const [method,setMethod]=useState("");
  const [selfScores,setSelfScores]=useState({});
  const [questions,setQuestions]=useState([]);
  const [currentQ,setCurrentQ]=useState(0);
  const [testAnswers,setTestAnswers]=useState({});
  const [testStage,setTestStage]=useState("questions");
  const [loading,setLoading]=useState(false);
  const [loadingMsg,setLoadingMsg]=useState("");
  const [results,setResults]=useState(null);
  const [mdp,setMdp]=useState(null);

  const WIZARD_STEPS=["Define Goal","Choose Method","Assessment","Results & MDP"];
  const targetRole=goalType==="existing"?positions.find(p=>p.id===Number(selectedPos))?.title:customGoal;

  async function generateCriteriaForCustomGoal(){
    if(!customGoal.trim())return;
    setLoading(true);setLoadingMsg("AI is analysing your career goal…");
    const r=await askClaude(
      `You are a career advisor. Generate skill criteria for a target role. Return ONLY valid JSON: {"criteria":[{"skill":"Name","required":75,"weight":"Critical"}]} — 6-8 skills, weight Critical/High/Medium/Low. No markdown.`,
      `Employee current role: ${emp.role}, Target goal: ${customGoal}`
    );
    setLoading(false);
    if(r?.criteria){
      setCriteria(r.criteria);
      const s={};r.criteria.forEach(c=>{s[c.skill]=emp.scores?.[c.skill]||50;});
      setSelfScores(s);setStep(2);
    }
  }

  function handleExistingPos(){
    const pos=positions.find(p=>p.id===Number(selectedPos));
    if(!pos)return;
    setCriteria(pos.criteria);
    const s={};pos.criteria.forEach(c=>{s[c.skill]=emp.scores?.[c.skill]||50;});
    setSelfScores(s);setStep(2);
  }

  async function analyzeFromSelfRate(){
    setLoading(true);setLoadingMsg("Analysing gaps & building your MDP…");
    const skillScores={};criteria.forEach(c=>{skillScores[c.skill]=selfScores[c.skill]||0;});
    await runGapAnalysis(skillScores);
  }

  async function generateTestQuestions(){
    setLoading(true);setLoadingMsg("AI is generating your test questions…");
    const skillList=criteria.map(c=>c.skill).join(", ");
    const r=await askClaude(
      `Generate 9 questions to objectively assess skills for a professional role. Mix EXACTLY 3 of each type:
- type "mcq": multiple choice, 4 options, mark correct (0-based index)
- type "short": short written answer (2-3 sentences), include model_answer
- type "scenario": workplace scenario description + 4 choices, mark correct (0-based)
Return ONLY valid JSON: {"questions":[{"id":1,"skill":"Skill Name","type":"mcq|short|scenario","question":"...","scenario_context":"..." (scenario only),"options":["A","B","C","D"] (mcq/scenario only),"correct":0 (mcq/scenario only),"model_answer":"..." (short only)}]}
Distribute across all skills. Make questions practical and realistic. No markdown.`,
      `Role: ${targetRole}, Skills to test: ${skillList}, Level: ${criteria.map(c=>c.weight+":"+c.skill).join(", ")}`,
      2000
    );
    setLoading(false);
    if(r?.questions&&r.questions.length>0){
      setQuestions(r.questions);setCurrentQ(0);setTestAnswers({});setTestStage("questions");setStep(3);
    }
  }

  async function submitTest(){
    setLoading(true);setLoadingMsg("AI is scoring your answers…");
    const autoScored={};
    questions.forEach(q=>{if(q.type!=="short"){const ans=testAnswers[q.id];autoScored[q.id]=(ans!==undefined&&ans===q.correct)?100:0;}});
    const shortQs=questions.filter(q=>q.type==="short"&&testAnswers[q.id]!==undefined);
    let shortScores={};
    if(shortQs.length>0){
      const payload=shortQs.map(q=>({id:q.id,question:q.question,model_answer:q.model_answer,employee_answer:testAnswers[q.id]||""}));
      const r=await askClaude(
        `Score these short answer responses for accuracy, completeness and professional understanding. Return ONLY valid JSON: {"scores":[{"id":1,"score":70,"feedback":"1 sentence feedback"}]} score is 0-100. Be fair but rigorous. No markdown.`,
        JSON.stringify(payload),1200
      );
      if(r?.scores)r.scores.forEach(s=>{shortScores[s.id]={score:s.score,feedback:s.feedback};});
    }
    const skillScoreMap={};const skillCountMap={};
    questions.forEach(q=>{
      const score=q.type==="short"?(shortScores[q.id]?.score||0):autoScored[q.id];
      if(!skillScoreMap[q.skill]){skillScoreMap[q.skill]=0;skillCountMap[q.skill]=0;}
      skillScoreMap[q.skill]+=score;skillCountMap[q.skill]+=1;
    });
    const computedSkillScores={};
    Object.keys(skillScoreMap).forEach(sk=>{computedSkillScores[sk]=Math.round(skillScoreMap[sk]/skillCountMap[sk]);});
    criteria.forEach(c=>{if(computedSkillScores[c.skill]===undefined)computedSkillScores[c.skill]=selfScores[c.skill]||50;});
    await runGapAnalysis(computedSkillScores,{shortScores,autoScored});
  }

  async function runGapAnalysis(skillScores,testData=null){
    const gaps=criteria.map(c=>({skill:c.skill,required:c.required,actual:skillScores[c.skill]||0,gap:Math.max(0,c.required-(skillScores[c.skill]||0)),weight:c.weight}));
    const fitScore=Math.round(
      criteria.reduce((s,c)=>{const a=skillScores[c.skill]||0;const w=c.weight==="Critical"?3:c.weight==="High"?2:1;return s+(Math.min(a/c.required,1))*w;},0)/
      Math.max(1,criteria.reduce((s,c)=>s+(c.weight==="Critical"?3:c.weight==="High"?2:1),0))*100
    );
    setLoadingMsg("Generating your personalised MDP…");
    const r=await askClaude(
      `You are a talent development coach. Analyse skill gaps and produce a development plan. Return ONLY valid JSON:
{"summary":"2 sentence overall summary","skill_analysis":[{"skill":"Name","score":75,"required":80,"recommendation":"1 sentence specific action to close this gap"}],"certifications":[{"name":"Name","provider":"Provider","why":"Why this cert closes a specific gap","priority":"High|Medium"}],"phases":[{"title":"Phase Title","timeline":"Month X-Y","actions":["action 1","action 2","action 3"]}]}
— skill_analysis for ALL skills including ones with no gap, 3 certs tied to gaps, 4 phases. Tie every action to specific skills. No markdown.`,
      `Employee: ${emp.name}, Role: ${emp.role}, Target: ${targetRole}, Fit: ${fitScore}%, All skills: ${JSON.stringify(gaps)}`,2000
    );
    setLoading(false);
    if(r){
      const gapCheck={targetRole,fit:fitScore,gaps:gaps.filter(g=>g.gap>0).length,date:new Date().toLocaleDateString(),method:testData?"test":"self-rate"};
      updateEmployee(emp.id,{selfGapChecks:[...(emp.selfGapChecks||[]),gapCheck]});
      addNotification("hr",emp.email,"Self Gap Check Completed",`${emp.name} completed a skill gap check for "${targetRole}" via ${testData?"AI-proctored test":"self-rating"}. Fit score: ${fitScore}%.`);
      setResults({gaps,fitScore,skillScores,testData});setMdp(r);setStep(4);showToast("Gap analysis complete!");
    }
  }

  function reset(){setStep(1);setResults(null);setMdp(null);setCriteria([]);setQuestions([]);setTestAnswers({});setMethod("");setSelectedPos("");setCustomGoal("");}

  return(
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div className="wizard-steps" style={{marginBottom:28}}>
        {WIZARD_STEPS.map((s,i)=>(
          <div key={i} className={`wizard-step ${step>i+1?"done":step===i+1?"active":""}`}>
            <div className="wizard-dot">{step>i+1?"✓":i+1}</div>
            <div className="wizard-lbl">{s}</div>
          </div>
        ))}
      </div>

      {step===1&&!loading&&(
        <div className="quiz-card">
          <div className="quiz-q">What role do you want to assess yourself for?</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Pick an existing company position or describe your own career goal.</div>
          <div className="tabs">
            <button className={`tab-btn ${goalType==="existing"?"active":""}`} onClick={()=>setGoalType("existing")}>🏢 Existing Position</button>
            <button className={`tab-btn ${goalType==="custom"?"active":""}`} onClick={()=>setGoalType("custom")}>✏️ Custom Career Goal</button>
          </div>
          {goalType==="existing"&&<>
            <div className="form-group">
              <label className="form-lbl">Select a Position</label>
              <select className="form-select" value={selectedPos} onChange={e=>setSelectedPos(e.target.value)}>
                <option value="">Choose a role to assess against…</option>
                {positions.map(p=><option key={p.id} value={p.id}>{p.title} — {p.department}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={handleExistingPos} disabled={!selectedPos}>Next: Choose Assessment Method →</button>
          </>}
          {goalType==="custom"&&<>
            <div className="form-group">
              <label className="form-lbl">Describe Your Career Goal</label>
              <textarea className="form-textarea" placeholder="e.g. I want to move from Software Engineer to Engineering Manager…" value={customGoal} onChange={e=>setCustomGoal(e.target.value)}/>
            </div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={generateCriteriaForCustomGoal} disabled={!customGoal.trim()}>✦ AI Generate Skill Criteria →</button>
          </>}
        </div>
      )}

      {step===2&&!loading&&(
        <div className="quiz-card">
          <div className="quiz-q">How would you like to assess your skills?</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:22}}>For role: <strong>{targetRole}</strong></div>
          <div className="method-cards">
            <div className={`method-card ${method==="self-rate"?"selected":""}`} onClick={()=>setMethod("self-rate")}>
              <div className="method-card-icon">🎚️</div>
              <div className="method-card-title">Self-Rate</div>
              <div className="method-card-desc">Drag sliders to rate your current skill levels. Quick, honest, and based on your own judgement.</div>
              {method==="self-rate"&&<div className="tag t-teal" style={{marginTop:10}}>Selected ✓</div>}
            </div>
            <div className={`method-card emp ${method==="test"?"selected":""}`} onClick={()=>setMethod("test")}>
              <div className="method-card-icon">🧪</div>
              <div className="method-card-title">Take a Test</div>
              <div className="method-card-desc">AI generates scenario, multiple choice and written questions. Your answers are scored objectively.</div>
              {method==="test"&&<div className="tag t-gold" style={{marginTop:10}}>Selected ✓</div>}
            </div>
          </div>
          {method&&<div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
            {method==="self-rate"&&<button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(3)}>Next: Rate My Skills →</button>}
            {method==="test"&&<button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={generateTestQuestions}>✦ Generate My Test →</button>}
          </div>}
        </div>
      )}

      {step===3&&method==="self-rate"&&!loading&&(
        <div className="quiz-card">
          <div className="quiz-q">Rate your current skill levels</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Be honest — this drives your gap analysis and development plan.</div>
          {criteria.map(c=>(
            <div className="form-group" key={c.skill}>
              <label className="form-lbl" style={{display:"flex",justifyContent:"space-between"}}>
                <span>{c.skill} <span className={`tag ${WC[c.weight]}`} style={{fontSize:9}}>{c.weight}</span></span>
                <span style={{color:"var(--navy)"}}>Required: {c.required}%</span>
              </label>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <input type="range" min={0} max={100} value={selfScores[c.skill]||0} onChange={e=>setSelfScores(s=>({...s,[c.skill]:Number(e.target.value)}))} style={{flex:1,accentColor:"var(--navy)"}}/>
                <span style={{fontFamily:"Syne",fontSize:15,fontWeight:800,color:fitColor(selfScores[c.skill]||0),minWidth:40,textAlign:"right"}}>{selfScores[c.skill]||0}%</span>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back</button>
            <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={analyzeFromSelfRate}>✦ Analyse My Skill Gaps →</button>
          </div>
        </div>
      )}

      {step===3&&method==="test"&&!loading&&questions.length>0&&testStage==="questions"&&(()=>{
        const q=questions[currentQ];
        const isAnswered=testAnswers[q.id]!==undefined;
        const allAnswered=questions.every(q=>testAnswers[q.id]!==undefined);
        return(
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <div className="test-dot-row">
              {questions.map((qq,i)=>(
                <div key={qq.id} className={`test-dot ${testAnswers[qq.id]!==undefined?"answered":""} ${i===currentQ?"current":""}`} onClick={()=>setCurrentQ(i)}>{i+1}</div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginBottom:16}}>
              <span>Question {currentQ+1} of {questions.length}</span>
              <span style={{color:"var(--navy)",fontWeight:600}}>{Object.keys(testAnswers).length}/{questions.length} answered</span>
            </div>
            <div className="test-card">
              {q.type==="mcq"&&<div className="test-type-badge t-teal">📋 Multiple Choice · {q.skill}</div>}
              {q.type==="scenario"&&<div className="test-type-badge t-amber">🏢 Scenario · {q.skill}</div>}
              {q.type==="short"&&<div className="test-type-badge t-purple">✏️ Short Answer · {q.skill}</div>}
              {q.type==="scenario"&&q.scenario_context&&<div className="test-scenario-box">{q.scenario_context}</div>}
              <div className="test-q">{q.question}</div>
              {(q.type==="mcq"||q.type==="scenario")&&<div className="quiz-options">
                {q.options?.map((opt,i)=>(
                  <button key={i} className={`quiz-opt ${testAnswers[q.id]===i?"selected":""}`} onClick={()=>setTestAnswers(a=>({...a,[q.id]:i}))}>
                    <div className="quiz-radio"/><span><strong style={{marginRight:6,color:"var(--muted)"}}>{String.fromCharCode(65+i)}.</strong>{opt}</span>
                  </button>
                ))}
              </div>}
              {q.type==="short"&&<>
                <textarea className="test-short-area" placeholder="Write your answer here (2–3 sentences)…" value={testAnswers[q.id]||""} onChange={e=>setTestAnswers(a=>({...a,[q.id]:e.target.value}))}/>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>Tip: focus on practical, specific examples from your experience.</div>
              </>}
            </div>
            <div className="test-nav" style={{marginTop:16}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setCurrentQ(i=>Math.max(0,i-1))} disabled={currentQ===0}>← Prev</button>
              {currentQ<questions.length-1
                ? <button className="btn btn-secondary btn-sm" onClick={()=>setCurrentQ(i=>i+1)} disabled={!isAnswered}>Next →</button>
                : <button className="btn btn-primary btn-sm" onClick={submitTest} disabled={!allAnswered} style={{opacity:allAnswered?1:0.5}}>
                    {allAnswered?"✦ Submit & Score Test →":"Answer all questions first"}
                  </button>
              }
            </div>
          </div>
        );
      })()}

      {loading&&<div className="loading-state"><div className="spinner"/><div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:"var(--navy)"}}>{loadingMsg||"Please wait…"}</div></div>}

      {step===4&&results&&mdp&&(
        <div>
          <div className="alert a-success" style={{marginBottom:20}}>
            <span>✓</span>
            {results.testData?"AI-scored test complete!":"Self-assessment complete!"} Your results and MDP are below.
          </div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-body" style={{display:"flex",alignItems:"center",gap:28}}>
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{fontFamily:"Syne",fontSize:52,fontWeight:800,color:fitColor(results.fitScore),lineHeight:1}}>{results.fitScore}%</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Fit Score</div>
                <div className={`tag ${fitTag(results.fitScore)}`} style={{marginTop:6}}>{fitLabel(results.fitScore)}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Target Role</div>
                <div style={{fontFamily:"Syne",fontSize:17,fontWeight:800,marginBottom:8,color:"var(--navy)"}}>{targetRole}</div>
                <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.65}}>{mdp.summary}</div>
              </div>
            </div>
          </div>
          <div style={{marginBottom:8,fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)"}}>Skill-by-Skill Breakdown</div>
          <div style={{marginBottom:16}}>
            {results.gaps.map(g=>{
              const skillRec=mdp.skill_analysis?.find(s=>s.skill===g.skill);
              const barColor=g.actual>=g.required?"var(--green)":g.actual>=g.required*0.75?"var(--amber)":"var(--red)";
              return(
                <div className="skill-result-card" key={g.skill}>
                  <div className="skill-result-hd">
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:600}}>{g.skill}</span>
                      <span className={`tag ${WC[g.weight]}`} style={{fontSize:9}}>{g.weight}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:11,color:"var(--muted)"}}>{g.actual}% / {g.required}%</span>
                      {g.gap>0?<span style={{fontSize:11,fontWeight:700,color:"var(--red)"}}>−{g.gap}% gap</span>:<span style={{fontSize:11,fontWeight:700,color:"var(--green)"}}>✓ Met</span>}
                    </div>
                  </div>
                  <div className="skill-result-body">
                    <div className="gap-track" style={{marginBottom:g.gap>0?8:0}}>
                      <div className="gap-req" style={{width:`${g.required}%`}}/>
                      <div className="gap-act" style={{width:`${g.actual}%`,background:barColor}}/>
                    </div>
                    {skillRec?.recommendation&&<div className="skill-rec">💡 {skillRec.recommendation}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {mdp.certifications?.length>0&&<div className="card" style={{marginBottom:16}}>
            <div className="card-hd"><div className="card-title">Recommended Certifications</div></div>
            <div className="card-body">
              {mdp.certifications.map((c,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:"var(--gold)",minWidth:28}}>{String(i+1).padStart(2,"0")}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{c.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{c.provider} · {c.why}</div></div>
                  <span className={`tag ${c.priority==="High"?"t-amber":"t-teal"}`}>{c.priority}</span>
                </div>
              ))}
            </div>
          </div>}

          <div className="card">
            <div className="card-hd"><div className="card-title">Your MDP — Linked to Skill Gaps</div></div>
            <div className="card-body">
              {mdp.phases?.map((ph,i)=>(
                <div className="dev-phase" key={i}>
                  <div className="dev-ph-hd"><div className="dev-ph-title">{ph.title}</div><span className="tag t-gold">{ph.timeline}</span></div>
                  <div className="dev-ph-body">{ph.actions?.map((a,j)=><div className="dev-action" key={j}><span className="dev-bullet">→</span><span>{a}</span></div>)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:16}}>
            <button className="btn btn-ghost" onClick={reset}>Run Another Gap Check</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── EMPLOYEE QUIZ ──────────────────────────────────────────────────────── */
function EmpQuiz({emp,pos,updateEmployee,showToast}){
  const [stage,setStage]=useState("intro");
  const [questions,setQuestions]=useState([]);
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [results,setResults]=useState(null);

  async function startQuiz(){
    if(!pos)return;
    setStage("loading");
    const r=await askClaude(
      `Generate exactly 5 multiple-choice quiz questions to test professional skills. Return ONLY valid JSON: {"questions":[{"id":1,"skill":"Skill","question":"Question?","options":["A","B","C","D"],"correct":0}]} correct is 0-based index. Scenario-based and practical. No markdown.`,
      `Role: ${pos.title}, Department: ${pos.department}, Level: ${pos.level}, Skills: ${pos.criteria.map(c=>c.skill).join(", ")}`
    );
    if(r?.questions){setQuestions(r.questions);setStage("quiz");setCurrent(0);setAnswers({});}
    else setStage("intro");
  }

  function handleAnswer(idx){
    const newAns={...answers,[current]:idx};
    setAnswers(newAns);
    if(current<questions.length-1){setTimeout(()=>setCurrent(current+1),350);}
    else{
      const score=Math.round(Object.entries(newAns).filter(([qi,ai])=>questions[qi]?.correct===ai).length/questions.length*100);
      const res={score,correct:Object.entries(newAns).filter(([qi,ai])=>questions[qi]?.correct===ai).length,total:questions.length,date:new Date().toLocaleDateString()};
      setResults(res);setStage("done");
      updateEmployee(emp.id,{quizHistory:[...(emp.quizHistory||[]),res]});
      showToast(`Quiz complete! Score: ${score}%`);
    }
  }

  if(stage==="intro")return(
    <div><div className="quiz-card" style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:16}}>◈</div>
      <div className="quiz-q">Skill Self-Assessment Quiz</div>
      <div style={{fontSize:13,color:"var(--muted)",margin:"10px auto 24px",lineHeight:1.7,maxWidth:420}}>AI-generated questions tailored to your role as <strong>{pos?.title||"your position"}</strong>.</div>
      {emp.quizHistory?.length>0&&<div className="alert a-success" style={{marginBottom:20,textAlign:"left"}}><span>✓</span>Last score: <strong>{emp.quizHistory[emp.quizHistory.length-1]?.score}%</strong></div>}
      <button className="btn btn-primary" style={{padding:"12px 32px"}} onClick={startQuiz} disabled={!pos}>Start Quiz →</button>
    </div></div>
  );

  if(stage==="loading")return(
    <div className="loading-state"><div className="spinner"/><div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:"var(--navy)"}}>Generating questions…</div></div>
  );

  if(stage==="quiz"&&questions[current])return(
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <div className="quiz-progress-bar"><div className="quiz-prog-fill" style={{width:`${(current/questions.length)*100}%`}}/></div>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:20}}>Question {current+1} of {questions.length} · <strong style={{color:"var(--navy)"}}>{questions[current].skill}</strong></div>
      <div className="quiz-card">
        <div className="quiz-q">{questions[current].question}</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:20}}>Select the best answer</div>
        <div className="quiz-options">
          {questions[current].options.map((opt,i)=>(
            <button key={i} className={`quiz-opt ${answers[current]===i?"selected":""}`} onClick={()=>handleAnswer(i)}>
              <div className="quiz-radio"/>{opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(stage==="done"&&results)return(
    <div style={{maxWidth:540,margin:"0 auto",textAlign:"center"}}>
      <div className="quiz-card">
        <div style={{fontSize:40,marginBottom:16}}>🎯</div>
        <div className="quiz-q">Assessment Complete!</div>
        <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:100,height:100,borderRadius:"50%",border:`2px solid ${fitColor(results.score)}`,margin:"20px auto",background:fitColor(results.score)+"12"}}>
          <div style={{fontFamily:"Syne",fontSize:30,fontWeight:800,color:fitColor(results.score),lineHeight:1}}>{results.score}%</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>Score</div>
        </div>
        <div style={{fontSize:14,color:"var(--muted)",margin:"16px 0 24px"}}>{results.correct} of {results.total} correct</div>
        <button className="btn btn-primary" onClick={()=>setStage("intro")}>Take Another</button>
      </div>
    </div>
  );
  return null;
}

/* ─── EMPLOYEE EQ PROFILE ────────────────────────────────────────────────── */
function EmpEQProfile({emp,updateEmployee,showToast}){
  const eq=emp.eq||{self:{},manager:{},history:[],simulations:[]};
  const [selfScores,setSelfScores]=useState({selfAwareness:eq.self?.selfAwareness||5,selfRegulation:eq.self?.selfRegulation||5,empathy:eq.self?.empathy||5,relationshipManagement:eq.self?.relationshipManagement||5,motivation:eq.self?.motivation||5});
  const [saved,setSaved]=useState(!!eq.self?.selfAwareness);

  function save(){
    const overall=Math.round(Object.values(selfScores).reduce((a,b)=>a+b,0)/5*10)/10;
    const newEq={...eq,self:selfScores,history:[...(eq.history||[]),{date:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}),overall}]};
    updateEmployee(emp.id,{eq:newEq});setSaved(true);showToast("EQ self-assessment saved!");
  }

  function eqColor(v){return v>=8?"var(--green)":v>=6?"var(--gold)":v>=4?"var(--amber)":"var(--red)";}
  const overall=Math.round(Object.values(selfScores).reduce((a,b)=>a+b,0)/5*10)/10;
  const mgrScores=eq.manager||{};
  const hasMgr=Object.values(mgrScores).some(v=>v>0);

  return(
    <div>
      <div className="alert a-info" style={{marginBottom:16}}><span>◑</span>Rate yourself honestly on each EQ dimension. Your manager will also rate you — the combined 360° view will be shared with your mentor to guide your sessions.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Your EQ Self-Assessment</div></div>
          <div className="card-body">
            {EQ_DIMS.map(dim=>(
              <div key={dim.key} className="eq-slider-wrap">
                <div className="eq-slider-hd"><span className="eq-slider-label">{dim.label}</span><span className="eq-slider-val">{selfScores[dim.key]}/10</span></div>
                <input type="range" min={1} max={10} value={selfScores[dim.key]} className="eq-slider" onChange={e=>setSelfScores(s=>({...s,[dim.key]:Number(e.target.value)}))}/>
                <div className="eq-dim-desc">{dim.desc}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,paddingTop:12,borderTop:"1px solid var(--border)"}}>
              <div><div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:eqColor(overall)}}>{overall}/10</div><div style={{fontSize:10,color:"var(--muted)"}}>Overall EQ</div></div>
              <button className="btn btn-primary" onClick={save}>Save Assessment</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">360° View</div></div>
          <div className="card-body">
            {!hasMgr&&<div className="alert a-gold"><span>◑</span>Manager EQ scores not yet submitted. They'll appear here once your manager completes the rating.</div>}
            {EQ_DIMS.map(dim=>{
              const s=selfScores[dim.key]||0;const m=mgrScores[dim.key]||0;
              const gap=hasMgr?Math.abs(s-m):null;
              return(
                <div key={dim.key} className="eq-dim-row">
                  <div className="eq-dim-name">{dim.label}</div>
                  <div className="eq-bar-wrap">
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{fontSize:9,color:"var(--muted)",width:28}}>Self</div>
                      <div className="eq-bar-track" style={{flex:1}}><div className="eq-bar-self" style={{width:`${s*10}%`}}/></div>
                      <span style={{fontSize:11,fontWeight:700,color:"var(--navy)",minWidth:20}}>{s}</span>
                    </div>
                    {hasMgr&&<div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{fontSize:9,color:"var(--muted)",width:28}}>Mgr</div>
                      <div className="eq-bar-track" style={{flex:1}}><div className="eq-bar-mgr" style={{width:`${m*10}%`}}/></div>
                      <span style={{fontSize:11,fontWeight:700,color:"#8a6d1f",minWidth:20}}>{m}</span>
                    </div>}
                  </div>
                  {hasMgr&&<span className={`eq-gap-badge ${gap>=3?"t-amber":gap>=1?"t-blue":"t-green"}`}>{gap>=3?"⚠":gap>=1?"△":"✓"}</span>}
                </div>
              );
            })}
            {hasMgr&&<div style={{marginTop:12,padding:10,background:"var(--gold-light)",borderRadius:7,fontSize:11,color:"var(--ink2)",lineHeight:1.6}}><strong style={{color:"var(--navy)"}}>360° Insight:</strong> Areas with a ⚠ gap (3+ points) often indicate blind spots — dimensions you see differently from how others experience you. These are the most valuable to work on with your mentor.</div>}
          </div>
        </div>
      </div>
      {(eq.history||[]).length>1&&(
        <div className="card">
          <div className="card-hd"><div className="card-title">EQ Growth Over Time</div></div>
          <div className="card-body" style={{paddingTop:4}}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={eq.history}>
                <XAxis dataKey="date" tick={{fontSize:11}}/><YAxis domain={[0,10]} tick={{fontSize:10}}/>
                <Tooltip contentStyle={{fontFamily:"Epilogue",fontSize:11,borderRadius:6,border:"1px solid var(--border)"}}/>
                <Line type="monotone" dataKey="overall" stroke="var(--navy)" strokeWidth={2.5} dot={{fill:"var(--gold)",stroke:"var(--navy)",r:4,strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── EMPLOYEE SIMULATIONS ───────────────────────────────────────────────── */
function EmpSimulations({emp,updateEmployee,showToast}){
  const done=emp.eq?.simulations||[];
  const pending=SIMULATIONS.filter(s=>!done.find(d=>d.id===s.id));
  const [current,setCurrent]=useState(pending[0]||null);
  const [selected,setSelected]=useState(null);
  const [revealed,setRevealed]=useState(false);

  function submit(){
    if(!selected)return;
    const opt=current.options.find(o=>o.letter===selected);
    const result={id:current.id,category:current.category,title:current.title,chosen:selected,eqImpact:opt.eqMap,date:new Date().toLocaleDateString()};
    const newSims=[...done,result];
    const newEq={...(emp.eq||{}),simulations:newSims};
    updateEmployee(emp.id,{eq:newEq});
    showToast("Simulation recorded!");
    setRevealed(true);
  }

  function next(){
    const remaining=SIMULATIONS.filter(s=>![...done,{id:current.id}].find(d=>d.id===s.id));
    if(remaining.length>0){setCurrent(remaining[0]);setSelected(null);setRevealed(false);}
    else setCurrent(null);
  }

  function calcPattern(sims){
    const totals={};let count={};
    sims.forEach(s=>{Object.entries(s.eqImpact||{}).forEach(([k,v])=>{totals[k]=(totals[k]||0)+v;count[k]=(count[k]||0)+1;});});
    return Object.entries(totals).map(([k,v])=>({dim:EQ_DIMS.find(d=>d.key===k)?.label||k,avg:Math.round(v/(count[k]||1)*10)/10})).sort((a,b)=>b.avg-a.avg);
  }

  const pattern=calcPattern(done);

  return(
    <div>
      <div className="alert a-purple" style={{marginBottom:16,background:"var(--purple-light)",color:"var(--purple)",border:"1px solid rgba(90,45,143,0.12)"}}>
        <span>⊛</span>These scenarios reveal your behavioural patterns — how you actually respond under pressure, not just how you think you would. Complete all 5 to build your full profile.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          {current&&!revealed&&(
            <div className="sim-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span className="tag t-purple">{current.category}</span>
                <span style={{fontSize:11,color:"var(--muted)"}}>{done.length+1} of {SIMULATIONS.length}</span>
              </div>
              <div className="sim-question">{current.title}</div>
              <div className="sim-scenario">{current.scenario}</div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--navy)",marginBottom:10}}>{current.question}</div>
              {current.options.map(o=>(
                <button key={o.letter} className={`sim-opt ${selected===o.letter?"selected":""}`} onClick={()=>setSelected(o.letter)}>
                  <span className="sim-opt-letter">{o.letter}</span><span>{o.text}</span>
                </button>
              ))}
              <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
                <button className="btn btn-primary" onClick={submit} disabled={!selected}>Submit Response →</button>
              </div>
            </div>
          )}
          {current&&revealed&&(
            <div className="sim-card">
              <div className="alert a-success" style={{marginBottom:12}}><span>✓</span>Response recorded. Here's what it revealed about your EQ profile.</div>
              <div className="sim-result">
                <div className="sim-result-title">EQ Dimensions This Response Reflects</div>
                {Object.entries(current.options.find(o=>o.letter===selected)?.eqMap||{}).sort(([,a],[,b])=>b-a).map(([k,v])=>(
                  <div key={k} className="sim-result-body" style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
                    <span>{EQ_DIMS.find(d=>d.key===k)?.label||k}</span><strong style={{color:v>=8?"var(--green)":v>=6?"var(--gold)":"var(--amber)"}}>{v}/10</strong>
                  </div>
                ))}
              </div>
              {pending.length>1&&<button className="btn btn-primary" style={{marginTop:16,width:"100%",justifyContent:"center"}} onClick={next}>Next Scenario →</button>}
              {pending.length<=1&&<div className="alert a-success" style={{marginTop:12}}><span>🎉</span>All simulations complete! Your behavioural pattern is now visible on the right.</div>}
            </div>
          )}
          {!current&&done.length>0&&(
            <div className="card">
              <div className="card-body" style={{textAlign:"center",padding:"36px 24px"}}>
                <div style={{fontSize:36,marginBottom:12}}>⊛</div>
                <div style={{fontFamily:"Syne",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:8}}>All simulations complete</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>Your behavioural pattern profile is ready. Your mentor can now see how you respond under pressure.</div>
              </div>
            </div>
          )}
          {!current&&done.length===0&&<div className="empty"><div className="empty-icon">⊛</div><div className="empty-title">No simulations available</div></div>}
        </div>

        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-hd"><div className="card-title">Completed Simulations</div><span className="tag t-teal">{done.length}/{SIMULATIONS.length}</span></div>
            <div className="card-body">
              {done.length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"16px 0"}}>Complete simulations to build your profile</div>}
              {done.map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div><div style={{fontSize:12,fontWeight:600}}>{s.title}</div><div style={{fontSize:10,color:"var(--muted)"}}>{s.category} · {s.date}</div></div>
                  <span className="tag t-purple">Option {s.chosen}</span>
                </div>
              ))}
            </div>
          </div>
          {pattern.length>0&&(
            <div className="card">
              <div className="card-hd"><div className="card-title">Your Behavioural Pattern</div></div>
              <div className="card-body">
                <div className="alert a-gold" style={{marginBottom:12}}><span>◑</span>This profile is based on your actual choices — not self-reported preferences.</div>
                {pattern.map((p,i)=>(
                  <div key={p.dim} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:600}}>{p.dim}</span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {i===0&&<span className="tag t-gold" style={{fontSize:9}}>Strength</span>}
                        {i===pattern.length-1&&pattern.length>1&&<span className="tag t-amber" style={{fontSize:9}}>Grow</span>}
                        <span style={{fontSize:11,fontWeight:700,color:p.avg>=8?"var(--green)":p.avg>=6?"var(--gold)":"var(--amber)"}}>{p.avg}/10</span>
                      </div>
                    </div>
                    <div className="prog"><div className="prog-fill" style={{width:`${p.avg*10}%`,background:p.avg>=8?"var(--green)":p.avg>=6?"var(--gold)":"var(--amber)"}}/></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── EMPLOYEE MENTOR ─────────────────────────────────────────────────────── */
function EmpMentor({emp,mentor,notifications,addNotification,showToast}){
  const [msg,setMsg]=useState("");
  const msgs=notifications.filter(n=>(n.to===emp.email&&n.from===mentor?.email)||(n.from===emp.email&&n.to===mentor?.email));

  function sendMsg(){
    if(!msg.trim()||!mentor)return;
    addNotification(mentor.email,emp.email,"Message from "+emp.name,msg);
    showToast("Message sent to "+mentor.name);setMsg("");
  }

  if(!mentor) return(
    <div className="card"><div className="card-body" style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:40,marginBottom:16}}>⊕</div>
      <div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:"var(--navy)",marginBottom:8}}>No mentor match yet</div>
      <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.7,maxWidth:380,margin:"0 auto"}}>Your HR team will match you with a mentor based on your EQ profile and simulation results. Complete your EQ assessment and simulations first to get the best match.</div>
    </div></div>
  );

  const pattern=emp.eq?.simulations?.length>0?[...emp.eq.simulations].sort((a,b)=>{
    const avgA=Object.values(a.eqImpact||{}).reduce((x,y)=>x+y,0)/Math.max(1,Object.keys(a.eqImpact||{}).length);
    const avgB=Object.values(b.eqImpact||{}).reduce((x,y)=>x+y,0)/Math.max(1,Object.keys(b.eqImpact||{}).length);
    return avgB-avgA;
  }):[];

  return(
    <div>
      <div className="mentor-match-card top" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div className="mentor-score-ring" style={{width:72,height:72}}>
            <div className="mentor-score-num">{emp.eq?.matchScore||"—"}</div><div className="mentor-score-lbl">Match</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:"var(--navy)",marginBottom:2}}>{mentor.name}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>{mentor.title} · {mentor.company} · {mentor.experience} experience</div>
            <div style={{marginBottom:10}}>{mentor.strengthTags.map(t=><span key={t} className="mentor-tag">{t}</span>)}</div>
            <div style={{fontSize:13,color:"var(--ink2)",lineHeight:1.6,fontStyle:"italic"}}>{mentor.bio}</div>
          </div>
        </div>
        <div className="why-matched" style={{marginTop:16}}>
          <div className="why-matched-title">Why You Were Matched</div>
          {EQ_DIMS.filter(d=>{const s=(emp.eq?.self?.[d.key]||0+emp.eq?.manager?.[d.key]||0)/2;return s<6&&(mentor.strengthScores?.[d.key]||0)>=8;}).map(d=>(
            <div key={d.key} className="why-matched-item"><span style={{color:"var(--gold)"}}>→</span>
            <span><strong>{d.label}:</strong> Your average is {Math.round(((emp.eq?.self?.[d.key]||0)+(emp.eq?.manager?.[d.key]||0))/2*10)/10}/10. {mentor.name} scores {mentor.strengthScores?.[d.key]}/10 — a strong mentor for this dimension.</span></div>
          ))}
          {EQ_DIMS.filter(d=>{const s=(emp.eq?.self?.[d.key]||0+emp.eq?.manager?.[d.key]||0)/2;return s<6&&(mentor.strengthScores?.[d.key]||0)>=8;}).length===0&&
            <div className="why-matched-item"><span style={{color:"var(--gold)"}}>→</span><span>Good overall EQ compatibility across all five dimensions.</span></div>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">What to Bring to Your First Session</div></div>
          <div className="card-body">
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>Based on your EQ profile and simulation results, here are the areas to focus on:</div>
            {EQ_DIMS.map(d=>{const s=emp.eq?.self?.[d.key]||0;const m=emp.eq?.manager?.[d.key]||0;const avg=(s+m)/2;
              if(avg>=7)return null;
              return(<div key={d.key} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600}}>{d.label}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"var(--amber)"}}>{Math.round(avg*10)/10}/10</span>
                </div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{d.desc}</div>
              </div>);
            })}
            {EQ_DIMS.every(d=>{const avg=((emp.eq?.self?.[d.key]||0)+(emp.eq?.manager?.[d.key]||0))/2;return avg>=7;})&&
              <div className="alert a-success"><span>✓</span>Strong EQ profile! Focus your sessions on advanced leadership scenarios.</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Send a Message</div></div>
          <div className="card-body">
            <textarea className="form-textarea" placeholder={`Write to ${mentor.name}…`} value={msg} onChange={e=>setMsg(e.target.value)} style={{minHeight:80,marginBottom:10}}/>
            <button className="btn btn-primary btn-sm" onClick={sendMsg} disabled={!msg.trim()}>Send Message →</button>
            {msgs.length>0&&<div style={{marginTop:16}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:8}}>Recent Messages</div>
              {msgs.slice(-4).map((n,i)=>(
                <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontSize:11,fontWeight:600,color:n.from===emp.email?"var(--navy)":"var(--gold)"}}>{n.from===emp.email?"You":"Mentor"} · {n.time}</div>
                  <div style={{fontSize:12,color:"var(--ink2)",marginTop:2}}>{n.body}</div>
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMPLOYEE PROGRESS ───────────────────────────────────────────────────── */
function EmpProgress({emp,pos,fit}){
  const log=emp.progressLog||[];
  return(
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-hd"><div className="card-title">Fit Score Over Time</div></div>
        <div className="card-body" style={{paddingTop:4}}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={log}>
              <XAxis dataKey="date" tick={{fontSize:11}}/><YAxis domain={[0,100]} tick={{fontSize:10}}/>
              <Tooltip contentStyle={{fontFamily:"Epilogue",fontSize:11,borderRadius:6,border:"1px solid var(--border)"}}/>
              <Line type="monotone" dataKey="score" stroke="var(--navy)" strokeWidth={2.5} dot={{fill:"var(--gold)",stroke:"var(--navy)",r:4,strokeWidth:2}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card"><div className="card-hd"><div className="card-title">Skill Progress</div></div>
          <div className="card-body">
            {pos?.criteria.map(c=>{const actual=emp.scores?.[c.skill]||0;
              return <div className="gap-row" key={c.skill}>
                <div className="gap-row-hd"><span style={{fontSize:12,fontWeight:500}}>{c.skill}</span><span style={{fontSize:11,fontWeight:700,color:fitColor(actual)}}>{actual}%</span></div>
                <div className="prog"><div className="prog-fill" style={{width:`${actual}%`,background:fitColor(actual)}}/></div>
              </div>;
            })}
          </div>
        </div>
        <div className="card"><div className="card-hd"><div className="card-title">Assessment & Gap History</div></div>
          <div className="card-body">
            {(!emp.quizHistory?.length&&!emp.selfGapChecks?.length)?<div className="empty"><div className="empty-icon">↗</div><div className="empty-title">No history yet</div></div>:<>
              {emp.quizHistory?.map((q,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div><div style={{fontSize:12,fontWeight:600}}>Quiz #{i+1}</div><div style={{fontSize:10,color:"var(--muted)"}}>{q.date}</div></div>
                  <span className={`tag ${fitTag(q.score)}`}>{q.score}%</span>
                </div>
              ))}
              {emp.selfGapChecks?.map((g,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div><div style={{fontSize:12,fontWeight:600}}>Gap Check: {g.targetRole}</div><div style={{fontSize:10,color:"var(--muted)"}}>{g.date}</div></div>
                  <span className={`tag ${fitTag(g.fit)}`}>{g.fit}%</span>
                </div>
              ))}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMPLOYEE DEV PLAN ───────────────────────────────────────────────────── */
function EmpDevPlan({emp,pos,fit,updateEmployee,showToast}){
  const [loading,setLoading]=useState(false);
  const devPlan=emp.devPlan;

  async function generate(){
    if(!pos)return;
    setLoading(true);
    const gaps=pos.criteria.map(c=>({skill:c.skill,required:c.required,actual:emp.scores?.[c.skill]||0,gap:Math.max(0,c.required-(emp.scores?.[c.skill]||0))})).filter(g=>g.gap>0);
    const r=await askClaude(
      `Create a personalised development plan. Return ONLY valid JSON: {"certifications":[{"name":"Name","provider":"Provider","why":"Why","priority":"High|Medium"}],"phases":[{"title":"Phase","timeline":"Month X","actions":["action"]}]} — 3 certs, 4 phases. Tie actions to specific skill gaps. No markdown.`,
      `Employee: ${emp.name}, Role: ${emp.role}, Target: ${pos.title}, Fit: ${fit}%, Gaps: ${JSON.stringify(gaps)}`
    );
    setLoading(false);
    if(r){updateEmployee(emp.id,{devPlan:r});showToast("Development plan generated!");}
  }

  return(
    <div>
      {!devPlan&&!loading&&<div className="card" style={{marginBottom:16}}>
        <div className="card-body" style={{textAlign:"center",padding:"36px 24px"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"var(--navy-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>⊕</div>
          <div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,marginBottom:8,color:"var(--navy)"}}>Your Personal Development Plan</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:24,lineHeight:1.7,maxWidth:420,margin:"0 auto 24px"}}>AI will analyse your skill gaps and generate a tailored MDP directly linked to your weakest areas.</div>
          <button className="btn btn-primary" style={{padding:"12px 32px"}} onClick={generate}>✦ Generate My MDP</button>
        </div>
      </div>}
      {loading&&<div className="loading-state"><div className="spinner"/><div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:"var(--navy)"}}>Building your MDP…</div></div>}
      {devPlan&&!loading&&<>
        <div className="alert a-success" style={{marginBottom:16}}><span>✓</span>Your development plan is ready — actions are linked to your specific skill gaps.</div>
        {devPlan.certifications?.length>0&&<div className="card" style={{marginBottom:16}}>
          <div className="card-hd"><div className="card-title">Recommended Certifications</div></div>
          <div className="card-body">
            {devPlan.certifications.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:"var(--gold)",minWidth:28}}>{String(i+1).padStart(2,"0")}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{c.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{c.provider} · {c.why}</div></div>
                <span className={`tag ${c.priority==="High"?"t-amber":"t-teal"}`}>{c.priority}</span>
              </div>
            ))}
          </div>
        </div>}
        <div className="card">
          <div className="card-hd"><div className="card-title">Growth Roadmap</div><button className="btn btn-ghost btn-sm" onClick={generate}>↻ Regenerate</button></div>
          <div className="card-body">
            {devPlan.phases?.map((ph,i)=>(
              <div className="dev-phase" key={i}>
                <div className="dev-ph-hd"><div className="dev-ph-title">{ph.title}</div><span className="tag t-gold">{ph.timeline}</span></div>
                <div className="dev-ph-body">{ph.actions?.map((a,j)=><div className="dev-action" key={j}><span className="dev-bullet">→</span><span>{a}</span></div>)}</div>
              </div>
            ))}
          </div>
        </div>
      </>}
    </div>
  );
}

/* ─── EMPLOYEE NOTIFICATIONS ─────────────────────────────────────────────── */
function EmpNotifications({notifications,email,markRead}){
  const mine=notifications.filter(n=>n.to===email);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-ghost btn-sm" onClick={markRead}>Mark all read</button>
      </div>
      <div className="card">
        {mine.length===0?<div className="empty"><div className="empty-icon">🔔</div><div className="empty-title">No notifications yet</div></div>:
          mine.map(n=>(
            <div key={n.id} className={`notif-item ${n.read?"":"unread"}`}>
              <div className={`notif-dot ${n.read?"read":""}`}/>
              <div style={{flex:1}}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ════════════ MENTOR APP ══════════════════════════════════════════════════ */
function MentorApp({session,mentors,employees,updateMentor,updateEmployee,notifications,setNotifications,addNotification,showToast,logout}){
  const [view,setView]=useState("dashboard");
  const [selectedMentee,setSelectedMentee]=useState(null);
  const mentor=mentors.find(m=>m.id===session.user.id)||session.user;
  const mentees=employees.filter(e=>mentor.matchedMenteeIds?.includes(e.id));
  const unread=notifications.filter(n=>n.to===mentor.email&&!n.read).length;
  const markRead=()=>setNotifications(ns=>ns.map(n=>n.to===mentor.email?{...n,read:true}:n));

  const NAV=[
    {id:"dashboard",icon:"⊞",label:"My Dashboard"},
    {id:"mentees",icon:"◎",label:"My Mentees",badge:mentees.length},
    {id:"sessions",icon:"◈",label:"Log Session"},
    {id:"impact",icon:"↗",label:"My Impact"},
    {id:"notif",icon:"🔔",label:"Messages",badgeRed:unread},
  ];

  return(
    <div className="app-shell fade-in">
      <aside className="sidebar">
        <div className="logo-wrap"><div className="logo-name">Talent<span>IQ</span></div><div className="logo-role">Mentor Portal</div></div>
        <div className="nav-section">
          <div className="nav-section-lbl">Mentoring</div>
          {NAV.map(n=>(
            <button key={n.id} className={`nav-item ${view===n.id?"active":""}`} onClick={()=>{setView(n.id);if(n.id!=="mentees")setSelectedMentee(null);}}>
              <span className="nav-icon">{n.icon}</span>{n.label}
              {n.badge>0&&<span className="nav-pill">{n.badge}</span>}
              {n.badgeRed>0&&<span className="nav-pill-red">{n.badgeRed}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-foot">
          <div className="s-user">
            <div className="s-avatar" style={{background:avatarBg(mentor.name)}}>{initials(mentor.name)}</div>
            <div><div className="s-name">{mentor.name}</div><div className="s-role">{mentor.title}</div></div>
            <button className="logout-btn" onClick={logout}>⏻</button>
          </div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div><div className="topbar-title">{{dashboard:"Mentor Dashboard",mentees:"My Mentees",sessions:"Log a Session",impact:"My Mentoring Impact",notif:"Messages & Notifications"}[view]}</div><div className="topbar-sub">TalentIQ Mentor Portal</div></div>
        </div>
        <div className="page fade-in" key={view+selectedMentee?.id}>
          {view==="dashboard"&&<MentorDashboard mentor={mentor} mentees={mentees} setView={setView} setSelectedMentee={setSelectedMentee}/>}
          {view==="mentees"&&!selectedMentee&&<MentorMenteeList mentees={mentees} mentor={mentor} setSelectedMentee={setSelectedMentee}/>}
          {view==="mentees"&&selectedMentee&&<MentorMenteeProfile mentee={selectedMentee} mentor={mentor} onBack={()=>setSelectedMentee(null)}/>}
          {view==="sessions"&&<MentorLogSession mentor={mentor} mentees={mentees} updateMentor={updateMentor} showToast={showToast} addNotification={addNotification}/>}
          {view==="impact"&&<MentorImpact mentor={mentor} mentees={mentees}/>}
          {view==="notif"&&<MentorMessages notifications={notifications} mentor={mentor} mentees={mentees} markRead={markRead} addNotification={addNotification} showToast={showToast}/>}
        </div>
      </div>
    </div>
  );
}

function MentorDashboard({mentor,mentees,setView,setSelectedMentee}){
  const totalSessions=(mentor.sessions||[]).length;
  const eqOverall=mentor.strengthScores?Math.round(Object.values(mentor.strengthScores).reduce((a,b)=>a+b,0)/5*10)/10:0;
  return(
    <div>
      <div className="emp-hero">
        <div className="emp-hero-left">
          <div className="emp-hero-greeting">Welcome back, mentor</div>
          <div className="emp-hero-name">{mentor.name}</div>
          <div className="emp-hero-role">{mentor.title} · {mentor.company} · {mentor.experience} experience</div>
          <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
            {mentor.strengthTags?.map(t=><span key={t} className="tag" style={{background:"rgba(201,168,76,0.18)",color:"var(--gold)",borderRadius:20}}>{t}</span>)}
          </div>
        </div>
        <div className="emp-hero-right">
          <div className="emp-score-ring"><div className="emp-score-num">{mentees.length}</div><div className="emp-score-lbl">Mentees</div></div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:8}}>Active matches</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {val:mentees.length,lbl:"Active Mentees",color:"var(--navy)"},
          {val:totalSessions,lbl:"Sessions Logged",color:"var(--gold)"},
          {val:eqOverall,lbl:"Your EQ Score",color:"var(--green)"},
          {val:mentor.strengthTags?.length||0,lbl:"EQ Strengths",color:"var(--purple)"},
        ].map(s=>(
          <div key={s.lbl} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",textAlign:"center",boxShadow:"var(--shadow)"}}>
            <div style={{fontFamily:"Syne",fontSize:24,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)"}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Your Mentees</div><button className="btn btn-ghost btn-sm" onClick={()=>setView("mentees")}>See All →</button></div>
          <div className="card-body">
            {mentees.length===0&&<div className="empty"><div className="empty-icon">◎</div><div className="empty-title">No mentees matched yet</div></div>}
            {mentees.map(e=>{
              const eqOverall=e.eq?.self?Math.round(Object.values(e.eq.self).reduce((a,b)=>a+b,0)/5*10)/10:null;
              return(
                <div key={e.id} className="mentee-profile-card" style={{marginBottom:8}} onClick={()=>{setSelectedMentee(e);setView("mentees");}}>
                  <div className="s-avatar" style={{background:avatarBg(e.name),width:36,height:36,borderRadius:8,fontSize:12,flexShrink:0}}>{initials(e.name)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{e.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{e.role} · {e.department}</div>
                    <div style={{marginTop:5,display:"flex",gap:6}}>
                      {eqOverall&&<span className="tag t-gold">EQ {eqOverall}/10</span>}
                      {e.eq?.simulations?.length>0&&<span className="tag t-purple">{e.eq.simulations.length} sims done</span>}
                      {e.eq?.matchScore&&<span className="tag t-teal">Match {e.eq.matchScore}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Your EQ Strengths</div></div>
          <div className="card-body">
            {EQ_DIMS.map(d=>(
              <div key={d.key} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600}}>{d.label}</span>
                  <span style={{fontSize:11,fontWeight:700,color:(mentor.strengthScores?.[d.key]||0)>=8?"var(--green)":"var(--gold)"}}>{mentor.strengthScores?.[d.key]||0}/10</span>
                </div>
                <div className="prog"><div className="prog-fill" style={{width:`${(mentor.strengthScores?.[d.key]||0)*10}%`,background:(mentor.strengthScores?.[d.key]||0)>=8?"var(--green)":"var(--gold)"}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorMenteeList({mentees,mentor,setSelectedMentee}){
  if(mentees.length===0) return <div className="card"><div className="card-body" style={{textAlign:"center",padding:"48px 24px"}}><div style={{fontSize:40,marginBottom:12}}>◎</div><div style={{fontFamily:"Syne",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:8}}>No mentees yet</div><div style={{fontSize:13,color:"var(--muted)"}}>HR will notify you when you're matched with a mentee.</div></div></div>;
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
      {mentees.map(e=>{
        const eqSelf=e.eq?.self;const eqMgr=e.eq?.manager;
        const selfOverall=eqSelf?Math.round(Object.values(eqSelf).reduce((a,b)=>a+b,0)/5*10)/10:null;
        return(
          <div key={e.id} className="card" style={{cursor:"pointer"}} onClick={()=>setSelectedMentee(e)}>
            <div className="card-body">
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                <div className="s-avatar" style={{background:avatarBg(e.name),width:44,height:44,borderRadius:10,fontSize:14}}>{initials(e.name)}</div>
                <div style={{flex:1}}><div style={{fontFamily:"Syne",fontSize:14,fontWeight:700,color:"var(--navy)"}}>{e.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{e.role} · {e.department}</div></div>
                {selfOverall&&<div style={{textAlign:"center"}}><div style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:"var(--gold)"}}>{selfOverall}</div><div style={{fontSize:9,color:"var(--muted)"}}>EQ</div></div>}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                <span className={`tag ${e.eq?.simulations?.length>0?"t-purple":"t-gray"}`}>{e.eq?.simulations?.length||0} simulations</span>
                <span className={`tag ${selfOverall?"t-teal":"t-gray"}`}>{selfOverall?"EQ assessed":"No EQ yet"}</span>
                <span className={`tag ${Object.values(eqMgr||{}).some(v=>v>0)?"t-blue":"t-gray"}`}>{Object.values(eqMgr||{}).some(v=>v>0)?"360° done":"Awaiting manager"}</span>
              </div>
              <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}}>View Full Profile →</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MentorMenteeProfile({mentee,mentor,onBack}){
  const eqSelf=mentee.eq?.self||{};const eqMgr=mentee.eq?.manager||{};
  const hasMgr=Object.values(eqMgr).some(v=>v>0);
  const pattern=mentee.eq?.simulations||[];

  return(
    <div>
      <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={onBack}>← Back to Mentees</button>
      <div className="mentor-match-card top" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div className="s-avatar" style={{background:avatarBg(mentee.name),width:56,height:56,borderRadius:12,fontSize:18}}>{initials(mentee.name)}</div>
          <div>
            <div style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:"var(--navy)"}}>{mentee.name}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>{mentee.role} · {mentee.department} · {mentee.experience}</div>
            <div style={{display:"flex",gap:6}}>
              <span className="tag t-teal">Match Score: {mentee.eq?.matchScore||"—"}</span>
              <span className={`tag ${mentee.devPlan?"t-green":"t-gray"}`}>{mentee.devPlan?"Has Dev Plan":"No Dev Plan"}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">360° EQ Profile</div></div>
          <div className="card-body">
            {!hasMgr&&<div className="alert a-gold" style={{marginBottom:12}}><span>◑</span>Manager EQ scores not yet submitted by HR.</div>}
            {EQ_DIMS.map(d=>{
              const s=eqSelf[d.key]||0;const m=eqMgr[d.key]||0;const ms=mentor.strengthScores?.[d.key]||0;
              const gap=hasMgr?Math.abs(s-m):null;
              return(
                <div key={d.key} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600}}>{d.label}</span>
                    <div style={{display:"flex",gap:8}}>
                      {gap>=3&&<span className="eq-gap-badge t-amber">⚠ {gap}pt gap</span>}
                      <span style={{fontSize:10,color:"var(--green)"}}>You: {ms}/10</span>
                    </div>
                  </div>
                  <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:3}}>
                    <div style={{height:"100%",width:`${s*10}%`,background:"var(--navy)",borderRadius:3}}/>
                  </div>
                  {hasMgr&&<div style={{height:4,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${m*10}%`,background:"var(--gold)",borderRadius:3}}/>
                  </div>}
                  <div style={{display:"flex",gap:12,marginTop:3,fontSize:10,color:"var(--muted)"}}>
                    <span>Self: {s}/10</span>{hasMgr&&<span>Manager: {m}/10</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-hd"><div className="card-title">Simulation Behavioural Pattern</div></div>
            <div className="card-body">
              {pattern.length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"16px 0"}}>No simulations completed yet</div>}
              {pattern.map((s,i)=>(
                <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:600}}>{s.title}</span><span className="tag t-purple">Option {s.chosen}</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {Object.entries(s.eqImpact||{}).sort(([,a],[,b])=>b-a).slice(0,2).map(([k,v])=>(
                      <span key={k} style={{fontSize:10,color:v>=8?"var(--green)":v>=6?"var(--gold)":"var(--amber)"}}>{EQ_DIMS.find(d=>d.key===k)?.label}: {v}/10</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Suggested Session Focus</div></div>
            <div className="card-body">
              <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Based on gaps where you score high and they score low:</div>
              {EQ_DIMS.filter(d=>{const s=eqSelf[d.key]||0;const ms=mentor.strengthScores?.[d.key]||0;return ms>=8&&s<6;}).map(d=>(
                <div key={d.key} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--navy)",marginBottom:2}}>{d.label}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>{d.desc}</div>
                </div>
              ))}
              {EQ_DIMS.every(d=>{const s=eqSelf[d.key]||0;const ms=mentor.strengthScores?.[d.key]||0;return !(ms>=8&&s<6);})&&
                <div className="alert a-success"><span>✓</span>Good overall EQ alignment. Focus on advanced leadership presence.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorLogSession({mentor,mentees,updateMentor,showToast,addNotification}){
  const [menteeId,setMenteeId]=useState(mentees[0]?.id||"");
  const [dim,setDim]=useState("selfAwareness");
  const [notes,setNotes]=useState("");
  const [growth,setGrowth]=useState(5);

  function save(){
    if(!notes.trim())return;
    const session={id:Date.now(),menteeId:Number(menteeId),menteeeName:mentees.find(m=>m.id===Number(menteeId))?.name||"",dimension:dim,notes,growthRating:growth,date:new Date().toLocaleDateString()};
    updateMentor(mentor.id,{sessions:[...(mentor.sessions||[]),session]});
    const m=mentees.find(x=>x.id===Number(menteeId));
    if(m)addNotification(m.email,mentor.email,"Session Notes Ready",`${mentor.name} has logged notes from your latest session (${EQ_DIMS.find(d=>d.key===dim)?.label}).`);
    showToast("Session logged!");setNotes("");setGrowth(5);
  }

  return(
    <div style={{maxWidth:640}}>
      <div className="card">
        <div className="card-hd"><div className="card-title">Log a Mentoring Session</div></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-lbl">Mentee</label>
            <select className="form-select" value={menteeId} onChange={e=>setMenteeId(e.target.value)}>
              {mentees.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              {mentees.length===0&&<option value="">No mentees yet</option>}
            </select>
          </div>
          <div className="form-group">
            <label className="form-lbl">EQ Dimension Focused On</label>
            <select className="form-select" value={dim} onChange={e=>setDim(e.target.value)}>
              {EQ_DIMS.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-lbl">Session Notes</label>
            <textarea className="form-textarea" placeholder="What did you work on? What did you observe? What did they commit to?" value={notes} onChange={e=>setNotes(e.target.value)} style={{minHeight:120}}/>
          </div>
          <div className="form-group">
            <label className="form-lbl">Growth Observed (1–10): <strong style={{color:"var(--gold)"}}>{growth}/10</strong></label>
            <input type="range" min={1} max={10} value={growth} className="eq-slider" onChange={e=>setGrowth(Number(e.target.value))}/>
          </div>
          <button className="btn btn-primary" onClick={save} disabled={!notes.trim()||mentees.length===0}>Save Session →</button>
        </div>
      </div>
      {(mentor.sessions||[]).length>0&&(
        <div className="card" style={{marginTop:16}}>
          <div className="card-hd"><div className="card-title">Recent Sessions</div></div>
          <div className="card-body">
            {[...(mentor.sessions||[])].reverse().slice(0,5).map(s=>(
              <div key={s.id} className="session-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div><span className="session-dim-tag">{EQ_DIMS.find(d=>d.key===s.dimension)?.label||s.dimension}</span><strong style={{fontSize:12}}>{s.menteeeName}</strong></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}><span className="tag t-gold">Growth: {s.growthRating}/10</span><span style={{fontSize:10,color:"var(--muted)"}}>{s.date}</span></div>
                </div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{s.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MentorImpact({mentor,mentees}){
  const sessions=mentor.sessions||[];
  const avgGrowth=sessions.length?Math.round(sessions.reduce((a,s)=>a+s.growthRating,0)/sessions.length*10)/10:0;
  const dimCounts={};sessions.forEach(s=>{dimCounts[s.dimension]=(dimCounts[s.dimension]||0)+1;});
  const topDim=Object.entries(dimCounts).sort(([,a],[,b])=>b-a)[0];

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {val:mentees.length,lbl:"Active Mentees",color:"var(--navy)"},
          {val:sessions.length,lbl:"Sessions Logged",color:"var(--gold)"},
          {val:avgGrowth||"—",lbl:"Avg Growth Rating",color:"var(--green)"},
          {val:topDim?EQ_DIMS.find(d=>d.key===topDim[0])?.label.split(" ")[0]:"—",lbl:"Top Focus Area",color:"var(--purple)"},
        ].map(s=>(
          <div key={s.lbl} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",textAlign:"center",boxShadow:"var(--shadow)"}}>
            <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)"}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Sessions by EQ Dimension</div></div>
          <div className="card-body">
            {EQ_DIMS.map(d=>{const c=dimCounts[d.key]||0;return(
              <div key={d.key} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:600}}>{d.label}</span><span style={{fontSize:11,fontWeight:700,color:"var(--navy)"}}>{c}</span></div>
                <div className="prog"><div className="prog-fill" style={{width:sessions.length?`${Math.round(c/sessions.length*100)}%`:"0%",background:"var(--navy)"}}/></div>
              </div>
            );})}
            {sessions.length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"16px 0"}}>No sessions logged yet</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Mentee EQ Progress</div></div>
          <div className="card-body">
            {mentees.map(e=>{
              const overall=e.eq?.self?Math.round(Object.values(e.eq.self).reduce((a,b)=>a+b,0)/5*10)/10:null;
              const hist=e.eq?.history||[];const first=hist[0]?.overall;const last=hist[hist.length-1]?.overall;const trend=first&&last?Math.round((last-first)*10)/10:null;
              return(
                <div key={e.id} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:600}}>{e.name}</span>
                    <div style={{display:"flex",gap:8}}>
                      {overall&&<span style={{fontFamily:"Syne",fontSize:14,fontWeight:800,color:"var(--gold)"}}>{overall}/10</span>}
                      {trend!==null&&<span className={`tag ${trend>0?"t-green":trend<0?"t-red":"t-gray"}`}>{trend>0?"+":""}{trend}</span>}
                    </div>
                  </div>
                  {hist.length>1&&<ResponsiveContainer width="100%" height={40}>
                    <LineChart data={hist}><Line type="monotone" dataKey="overall" stroke="var(--navy)" strokeWidth={1.5} dot={false}/></LineChart>
                  </ResponsiveContainer>}
                </div>
              );
            })}
            {mentees.length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"16px 0"}}>No mentees yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorMessages({notifications,mentor,mentees,markRead,addNotification,showToast}){
  const [selectedMentee,setSelectedMentee]=useState(mentees[0]||null);
  const [msg,setMsg]=useState("");
  const mine=notifications.filter(n=>n.to===mentor.email);

  function send(){
    if(!msg.trim()||!selectedMentee)return;
    addNotification(selectedMentee.email,mentor.email,"Message from "+mentor.name,msg);
    showToast("Message sent");setMsg("");
  }

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div className="card">
        <div className="card-hd"><div className="card-title">All Notifications</div><button className="btn btn-ghost btn-sm" onClick={markRead}>Mark all read</button></div>
        <div className="card-body" style={{padding:0}}>
          {mine.length===0&&<div className="empty"><div className="empty-icon">🔔</div><div className="empty-title">No messages yet</div></div>}
          {mine.map(n=>(
            <div key={n.id} className={`notif-item ${n.read?"":"unread"}`}>
              <div className={`notif-dot ${n.read?"read":""}`}/>
              <div style={{flex:1}}><div className="notif-title">{n.title}</div><div className="notif-sub">{n.body}</div><div className="notif-time">{n.time} · From: {n.from}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-hd"><div className="card-title">Message a Mentee</div></div>
        <div className="card-body">
          {mentees.length===0&&<div style={{fontSize:13,color:"var(--muted)"}}>No mentees to message yet.</div>}
          {mentees.length>0&&<>
            <div className="form-group">
              <label className="form-lbl">To</label>
              <select className="form-select" value={selectedMentee?.id||""} onChange={e=>setSelectedMentee(mentees.find(m=>m.id===Number(e.target.value)))}>
                {mentees.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-lbl">Message</label>
              <textarea className="form-textarea" placeholder="Write your message…" value={msg} onChange={e=>setMsg(e.target.value)} style={{minHeight:100}}/>
            </div>
            <button className="btn btn-primary btn-sm" onClick={send} disabled={!msg.trim()}>Send →</button>
          </>}
        </div>
      </div>
    </div>
  );
}
