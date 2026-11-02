import { useId } from "react";
import { T } from "../../context/LanguageContext.jsx";

function Artwork({ kind }) {
  switch (kind) {
    case "devops-solutions":
      return <>
        <path d="M146 150h156a45 45 0 0 0 1-90 66 66 0 0 0-126-7 49 49 0 0 0-31 97Z" fill="#c8daf0" />
        <path d="M183 103h74m-59-19-19 19 19 19m44-38 19 19-19 19" stroke="#1673ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M220 153v43M99 240v-44h242v44" stroke="#9bbad8" strokeWidth="5" strokeLinejoin="round" />
        {[60, 181, 302].map((x, index) => <g key={x}>
          <rect x={x} y="228" width="78" height="68" rx="12" fill={index === 1 ? "#9bbad8" : "#c8daf0"} />
          <circle cx={x + 39} cy="262" r="20" fill="#e7f0fa" />
        </g>)}
        <path d="m87 253-9 9 9 9m23-18 9 9-9 9m104-10 7 7 13-16" stroke="#1673ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M329 266v-13l13-7 13 7v13l-13 7Z" stroke="#1673ff" strokeWidth="3" />
        <circle cx="342" cy="260" r="5" fill="#1673ff" />
      </>;
    case "architecture-design":
      return <>
        <path d="M220 112v46M83 205v-47h274v47m-137-47v47M83 259v38m137-38v38m137-38v38" stroke="#9bbad8" strokeWidth="5" strokeLinejoin="round" />
        <rect x="153" y="35" width="134" height="80" rx="13" fill="#9bbad8" />
        <rect x="171" y="53" width="98" height="11" rx="5" fill="#e7f0fa" />
        <path d="M177 80h39m-39 15h70" stroke="#c8daf0" strokeWidth="7" strokeLinecap="round" />
        {[38, 175, 312].map((x, index) => <g key={x}>
          <rect x={x} y="196" width="90" height="66" rx="12" fill="#c8daf0" />
          <rect x={x + 17} y="211" width="56" height="10" rx="4" fill="#9bbad8" />
          <path d={`M${x + 20} 240h${index === 1 ? 48 : 30}`} stroke="#9bbad8" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx={x + 45} cy="296" rx="26" ry="11" fill="#9bbad8" />
          <path d={`M${x + 19} 296v14c0 15 52 15 52 0v-14`} fill="#afc8e2" />
        </g>)}
        <circle cx="220" cy="158" r="8" fill="#1673ff" />
      </>;
    case "poc-mvp-development":
      return <>
        <path d="M48 286h345" stroke="#c8daf0" strokeWidth="5" strokeLinecap="round" />
        <rect x="32" y="110" width="104" height="154" rx="14" fill="#c8daf0" />
        <rect x="168" y="77" width="104" height="187" rx="14" fill="#afc8e2" />
        <rect x="304" y="43" width="104" height="221" rx="14" fill="#9bbad8" />
        <rect x="46" y="128" width="76" height="72" rx="5" stroke="#9bbad8" strokeWidth="3" strokeDasharray="7 6" />
        <path d="m55 190 18-22 15 15 24-34M48 221h54m-54 18h34" stroke="#9bbad8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="182" y="95" width="76" height="72" rx="6" fill="#dce8f5" />
        <path d="m211 114 23 17-23 17Z" fill="#1673ff" />
        <path d="M185 189h65m-65 19h49m-49 19h58" stroke="#e7f0fa" strokeWidth="7" strokeLinecap="round" />
        <circle cx="356" cy="114" r="29" fill="#e7f0fa" />
        <path d="m341 114 10 10 21-23" stroke="#1673ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="321" y="170" width="70" height="12" rx="5" fill="#dce8f5" />
        <rect x="321" y="193" width="51" height="9" rx="4" fill="#c8daf0" />
        <path d="M145 181h13m-7-7 7 7-7 7m130-34h13m-7-7 7 7-7 7" stroke="#1673ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[84, 220, 356].map(x => <circle key={x} cx={x} cy="286" r="8" fill="#1673ff" />)}
      </>;
    case "qa-testing":
      return <>
        <rect x="100" y="37" width="216" height="267" rx="18" fill="#c8daf0" />
        <rect x="118" y="57" width="180" height="229" rx="10" fill="#e7f0fa" />
        <rect x="163" y="25" width="90" height="38" rx="10" fill="#9bbad8" />
        {[105, 162, 219].map(y => <g key={y}>
          <rect x="139" y={y - 12} width="26" height="26" rx="6" fill="#afc8e2" />
          <path d={`m145 ${y + 1} 5 5 9-11`} stroke="#1673ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M181 ${y - 4}h85m-85 15h59`} stroke="#afc8e2" strokeWidth="7" strokeLinecap="round" />
        </g>)}
        <circle cx="303" cy="233" r="43" fill="#dce8f5" stroke="#9bbad8" strokeWidth="10" />
        <path d="m334 265 31 31" stroke="#9bbad8" strokeWidth="17" strokeLinecap="round" />
        <path d="m285 234 12 12 24-28" stroke="#1673ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>;
    case "ux-ui-design":
      return <>
        <rect x="38" y="45" width="364" height="245" rx="16" fill="#c8daf0" />
        <path d="M38 84h364" stroke="#9bbad8" strokeWidth="3" />
        {[59, 74, 89].map(x => <circle key={x} cx={x} cy="65" r="4" fill="#9bbad8" />)}
        <rect x="58" y="103" width="61" height="167" rx="8" fill="#afc8e2" />
        {[127, 170, 213].map((y, index) => <rect key={y} x="72" y={y} width="32" height="26" rx="5" fill={["#1673ff", "#9bbad8", "#e7f0fa"][index]} />)}
        <rect x="141" y="103" width="240" height="87" rx="8" fill="#9bbad8" />
        <rect x="157" y="121" width="118" height="10" rx="4" fill="#e7f0fa" />
        <rect x="157" y="141" width="82" height="7" rx="3" fill="#c8daf0" />
        <rect x="157" y="159" width="57" height="16" rx="5" fill="#1673ff" />
        <rect x="141" y="208" width="110" height="62" rx="8" fill="#afc8e2" />
        <rect x="269" y="208" width="112" height="62" rx="8" fill="#afc8e2" />
        <path d="m283 178 5 70 18-23 26 23 11-13-28-22 29-11Z" fill="#e7f0fa" stroke="#1673ff" strokeWidth="3" strokeLinejoin="round" />
      </>;
    case "business-analysis":
      return <>
        <rect x="48" y="43" width="344" height="236" rx="16" fill="#c8daf0" />
        <path d="M74 66h116m-116 16h74" stroke="#9bbad8" strokeWidth="8" strokeLinecap="round" />
        <path d="M90 115v133h257" stroke="#9bbad8" strokeWidth="4" strokeLinecap="round" />
        <rect x="110" y="192" width="42" height="54" rx="5" fill="#afc8e2" />
        <rect x="172" y="166" width="42" height="80" rx="5" fill="#afc8e2" />
        <rect x="234" y="139" width="42" height="107" rx="5" fill="#9bbad8" />
        <rect x="296" y="104" width="42" height="142" rx="5" fill="#9bbad8" />
        <path d="m116 164 66-27 66-37 73-30m-22-4 25 3-10 23" stroke="#1673ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M106 308h228" stroke="#afc8e2" strokeWidth="4" />
        {[106, 182, 258, 334].map((x, index) => <circle key={x} cx={x} cy="308" r={index === 3 ? 10 : 7} fill={index === 3 ? "#1673ff" : "#9bbad8"} />)}
      </>;
    default:
      return <>
        <rect x="40" y="30" width="300" height="200" rx="14" fill="#c8daf0" />
        <rect x="55" y="50" width="190" height="150" rx="7" fill="#9bbad8" />
        <rect x="255" y="50" width="74" height="60" rx="7" fill="#9bbad8" />
        <rect x="255" y="120" width="74" height="50" rx="7" fill="#afc8e2" />
        <rect x="130" y="215" width="70" height="120" rx="12" fill="#b5ccdf" stroke="#9bbad8" strokeWidth="1.5" />
        <rect x="140" y="230" width="50" height="80" rx="4" fill="#ccdff0" />
        <circle cx="165" cy="320" r="5" fill="#9bbad8" />
        <rect x="64" y="62" width="110" height="10" rx="4" fill="#ffffff8c" />
        <rect x="64" y="80" width="75" height="7" rx="3" fill="#ffffff61" />
        <rect x="64" y="95" width="100" height="7" rx="3" fill="#ffffff61" />
        <rect x="64" y="110" width="60" height="7" rx="3" fill="#ffffff47" />
      </>;
  }
}

export default function ServiceIllustration({ service }) {
  const titleId = useId();
  return <svg key={service.slug} className="svc-illustration" width="440" height="340"
    viewBox="0 0 440 340" fill="none" role="img" aria-labelledby={titleId} data-service={service.slug}>
    <title id={titleId}><T text={service.title} /></title>
    <Artwork kind={service.slug} />
  </svg>;
}
