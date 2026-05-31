
/* ============================================================
   SAVEAI LATEX MATH PATCH — injected to fix DOCX math export
   Converts LaTeX $...$ and $$...$$ to proper OfficeMath XML
   ============================================================ */

// Build OOXML m:oMath XML from a LaTeX string
function saveaiLatexToOfficeMathXML(latex, isDisplay) {
  const s = latex.trim();
  let pos = 0;

  function peek() { return s[pos]; }
  function advance() { return s[pos++]; }
  function skipSpaces() { while (pos < s.length && /\s/.test(s[pos])) pos++; }

  function parseGroup() {
    skipSpaces();
    if (peek() === '{') {
      advance();
      const result = parseSequence('}');
      if (peek() === '}') advance();
      return result;
    }
    skipSpaces();
    const tok = parseSingleToken();
    return tok ? [tok] : [];
  }

  function parseOptional() {
    skipSpaces();
    if (peek() !== '[') return null;
    advance();
    let content = '';
    while (pos < s.length && peek() !== ']') content += advance();
    if (peek() === ']') advance();
    return content;
  }

  function mr(text) {
    return '<m:r><m:t>' + text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</m:t></m:r>';
  }

  function parseSingleToken() {
    skipSpaces();
    if (pos >= s.length || peek() === '}') return null;
    if (peek() === '{') { const g = parseGroup(); return g.join(''); }

    if (peek() === '\\') {
      advance();
      if (pos < s.length && !/[a-zA-Z]/.test(s[pos])) {
        const ch = advance();
        if (ch === ',' || ch === ';' || ch === '!' || ch === ':') return mr('\u00a0');
        if (ch === '\\') return mr(' ');
        return mr(ch);
      }
      let cmd = '';
      while (pos < s.length && /[a-zA-Z]/.test(s[pos])) cmd += s[pos++];

      if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
        const num = parseGroup().join('');
        const den = parseGroup().join('');
        return '<m:f><m:num>' + num + '</m:num><m:den>' + den + '</m:den></m:f>';
      }
      if (cmd === 'sqrt') {
        parseOptional();
        const c = parseGroup().join('');
        return '<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>' + c + '</m:e></m:rad>';
      }
      if (cmd === 'left') {
        skipSpaces();
        let br = '';
        if (peek() === '\\') { advance(); while (pos < s.length && /[a-zA-Z]/.test(s[pos])) { br += s[pos++]; } }
        else if (pos < s.length) br = advance();
        const inner = parseSequence('RIGHTBRACKET').join('');
        const openChar = br === '(' ? '(' : br === '[' ? '[' : br === '|' ? '|' : '(';
        const closeChar = br === '(' ? ')' : br === '[' ? ']' : br === '|' ? '|' : ')';
        return '<m:d><m:dPr><m:begChr m:val="' + openChar + '"/><m:endChr m:val="' + closeChar + '"/></m:dPr><m:e>' + inner + '</m:e></m:d>';
      }
      if (cmd === 'right') {
        skipSpaces();
        if (peek() === '\\') { advance(); while (pos < s.length && /[a-zA-Z]/.test(s[pos])) pos++; }
        else if (pos < s.length) advance();
        return '__RIGHTBRACKET__';
      }
      if (cmd === 'begin') {
        skipSpaces();
        let envName = '';
        if (peek() === '{') { advance(); while (pos < s.length && s[pos] !== '}') envName += s[pos++]; if (peek() === '}') advance(); }
        const closeStr = '\\end{' + envName + '}';
        let body = '';
        while (pos < s.length) {
          if (s.substring(pos, pos + closeStr.length) === closeStr) { pos += closeStr.length; break; }
          body += s[pos++];
        }
        const rows = body.split('\\\\').map(r => r.trim());
        const cells = rows.flatMap(r => r.split('&').map(c => c.trim()));
        const cellXml = cells.map(c => {
          const cellInner = saveaiLatexToOfficeMathXML(c, false).replace(/<\/?m:oMath>/g,'').replace(/<\/?m:oMathPara>/g,'');
          return '<m:e>' + cellInner + '</m:e>';
        }).join('');
        const openCh = envName === 'pmatrix' ? '(' : envName === 'bmatrix' ? '[' : envName === 'vmatrix' ? '|' : '';
        const closeCh = envName === 'pmatrix' ? ')' : envName === 'bmatrix' ? ']' : envName === 'vmatrix' ? '|' : '';
        if (openCh) return '<m:d><m:dPr><m:begChr m:val="' + openCh + '"/><m:endChr m:val="' + closeCh + '"/></m:dPr>' + cellXml + '</m:d>';
        return cellXml;
      }
      if (cmd === 'end') {
        if (peek() === '{') { advance(); while (pos < s.length && s[pos] !== '}') pos++; if (peek() === '}') advance(); }
        return null;
      }
      if (cmd === 'text' || cmd === 'mathrm' || cmd === 'mathbf' || cmd === 'mathit' || cmd === 'mathcal') {
        skipSpaces();
        if (peek() === '{') {
          advance();
          let t = ''; let depth = 1;
          while (pos < s.length && depth > 0) {
            if (s[pos] === '{') depth++;
            else if (s[pos] === '}') { depth--; if (depth === 0) { pos++; break; } }
            t += s[pos++];
          }
          return mr(t);
        }
      }
      if (cmd === 'mathbb') {
        skipSpaces();
        if (peek() === '{') { advance(); let c = ''; while (pos < s.length && s[pos] !== '}') c += s[pos++]; if (peek() === '}') advance(); return mr(c); }
      }
      if (cmd === 'bar' || cmd === 'overline') { const c = parseGroup().join(''); return c + mr('\u0305'); }
      if (cmd === 'hat' || cmd === 'widehat') { const c = parseGroup().join(''); return c + mr('\u0302'); }
      if (cmd === 'tilde' || cmd === 'widetilde') { const c = parseGroup().join(''); return c + mr('\u0303'); }
      if (cmd === 'vec') { const c = parseGroup().join(''); return c + mr('\u20d7'); }
      if (cmd === 'dot') { const c = parseGroup().join(''); return c + mr('\u0307'); }
      if (cmd === 'ddot') { const c = parseGroup().join(''); return c + mr('\u0308'); }

      // Nary operators (sum, int, prod etc.)
      const naryMap = {
        sum:'\u2211', prod:'\u220f', coprod:'\u2210',
        int:'\u222b', iint:'\u222c', iiint:'\u222d', oint:'\u222e',
        bigcup:'\u22c3', bigcap:'\u22c2', bigvee:'\u22c1', bigwedge:'\u22c0',
        bigoplus:'\u2a01', bigotimes:'\u2a02', bigsqcup:'\u2a06',
        lim:'lim', min:'min', max:'max', inf:'inf', sup:'sup'
      };
      if (naryMap[cmd] !== undefined) {
        let sub = null, sup_ = null;
        skipSpaces();
        if (peek() === '_') { advance(); sub = parseGroup().join(''); skipSpaces(); }
        if (peek() === '^') { advance(); sup_ = parseGroup().join(''); skipSpaces(); }
        if (peek() === '_') { advance(); sub = parseGroup().join(''); skipSpaces(); }
        const nChar = naryMap[cmd];
        const isLim = (cmd === 'lim' || cmd === 'min' || cmd === 'max' || cmd === 'inf' || cmd === 'sup');
        const isInt = (cmd === 'int' || cmd === 'iint' || cmd === 'iiint' || cmd === 'oint');
        const limLoc = isInt ? 'subSup' : 'undOvr';
        const hideSub = sub ? '' : '<m:subHide m:val="1"/>';
        const hideSup = sup_ ? '' : '<m:supHide m:val="1"/>';
        let charEl;
        if (isLim) {
          charEl = '<m:chr m:val="' + nChar + '"/>';
        } else {
          charEl = '<m:chr m:val="' + nChar + '"/>';
        }
        return '<m:nary><m:naryPr>' + charEl + '<m:limLoc m:val="' + limLoc + '"/>' + hideSub + hideSup + '</m:naryPr><m:sub>' + (sub || '') + '</m:sub><m:sup>' + (sup_ || '') + '</m:sup><m:e></m:e></m:nary>';
      }

      const opMap = {
        times:'\u00d7', div:'\u00f7', pm:'\u00b1', mp:'\u2213', cdot:'\u00b7',
        leq:'\u2264', le:'\u2264', geq:'\u2265', ge:'\u2265', neq:'\u2260', ne:'\u2260',
        approx:'\u2248', equiv:'\u2261', infty:'\u221e', partial:'\u2202', nabla:'\u2207',
        alpha:'\u03b1', beta:'\u03b2', gamma:'\u03b3', delta:'\u03b4', epsilon:'\u03b5',
        varepsilon:'\u03b5', zeta:'\u03b6', eta:'\u03b7', theta:'\u03b8', iota:'\u03b9',
        kappa:'\u03ba', lambda:'\u03bb', mu:'\u03bc', nu:'\u03bd', xi:'\u03be',
        pi:'\u03c0', rho:'\u03c1', sigma:'\u03c3', tau:'\u03c4', upsilon:'\u03c5',
        phi:'\u03c6', chi:'\u03c7', psi:'\u03c8', omega:'\u03c9',
        vartheta:'\u03d1', varpi:'\u03d6', varrho:'\u03f1', varsigma:'\u03c2', varphi:'\u03d5',
        Gamma:'\u0393', Delta:'\u0394', Theta:'\u0398', Lambda:'\u039b', Xi:'\u039e',
        Pi:'\u03a0', Sigma:'\u03a3', Upsilon:'\u03a5', Phi:'\u03a6', Psi:'\u03a8', Omega:'\u03a9',
        rightarrow:'\u2192', leftarrow:'\u2190', Rightarrow:'\u21d2', Leftarrow:'\u21d0',
        leftrightarrow:'\u2194', Leftrightarrow:'\u21d4', to:'\u2192', gets:'\u2190',
        mapsto:'\u21a6', uparrow:'\u2191', downarrow:'\u2193',
        in:'\u2208', notin:'\u2209', subset:'\u2282', supset:'\u2283',
        subseteq:'\u2286', supseteq:'\u2287', cap:'\u2229', cup:'\u222a',
        setminus:'\u2216', emptyset:'\u2205', forall:'\u2200', exists:'\u2203', nexists:'\u2204',
        oplus:'\u2295', ominus:'\u2296', otimes:'\u2297', odot:'\u2299',
        sqrt:'\u221a', hbar:'\u210f', ell:'\u2113', Re:'\u211c', Im:'\u2111',
        aleph:'\u2135', land:'\u2227', lor:'\u2228', neg:'\u00ac',
        vdots:'\u22ee', cdots:'\u22ef', ddots:'\u22f1', ldots:'\u2026',
        prime:'\u2032', angle:'\u2220', perp:'\u22a5', parallel:'\u2225',
        sim:'\u223c', simeq:'\u2243', cong:'\u2245', ll:'\u226a', gg:'\u226b',
        propto:'\u221d', therefore:'\u2234', because:'\u2235',
        ast:'*', circ:'\u2218', bullet:'\u2022', star:'\u22c6', diamond:'\u22c4',
        bowtie:'\u22c8', ltimes:'\u22c9', rtimes:'\u22ca',
        vdash:'\u22a2', models:'\u22a8', top:'\u22a4', bot:'\u22a5',
        oiint:'\u222f', oint:'\u222e',
        langle:'\u27e8', rangle:'\u27e9'
      };
      if (opMap[cmd] !== undefined) return mr(opMap[cmd]);

      // Function names rendered as text
      const funcNames = ['sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan',
        'sinh','cosh','tanh','coth','log','ln','exp','det','dim','ker','hom','arg',
        'gcd','lcm','mod','deg','Pr','tr','rank'];
      if (funcNames.includes(cmd)) return mr(cmd);

      return mr('\\' + cmd);
    }

    if (peek() === '&') { advance(); return mr(' '); }
    if (peek() === ' ') { advance(); return mr(' '); }
    const ch = advance();
    return mr(ch);
  }

  function parseSequence(endChar) {
    const result = [];
    while (pos < s.length) {
      if (endChar === '}' && peek() === '}') break;
      if (endChar === 'RIGHTBRACKET') {
        // handled by __RIGHTBRACKET__ sentinel
      }
      skipSpaces();
      if (pos >= s.length) break;
      if (endChar === '}' && peek() === '}') break;
      let tok = parseSingleToken();
      if (!tok) continue;
      if (tok === '__RIGHTBRACKET__') break;
      // Handle sub/superscripts that follow
      skipSpaces();
      let hasSub = false, hasSup = false, subContent = '', supContent = '';
      while (peek() === '^' || peek() === '_') {
        const op = advance();
        const arg = parseGroup().join('');
        if (op === '^') { hasSup = true; supContent = arg; }
        else { hasSub = true; subContent = arg; }
        skipSpaces();
      }
      if (hasSub && hasSup) {
        tok = '<m:sSubSup><m:e>' + tok + '</m:e><m:sub>' + subContent + '</m:sub><m:sup>' + supContent + '</m:sup></m:sSubSup>';
      } else if (hasSub) {
        tok = '<m:sSub><m:e>' + tok + '</m:e><m:sub>' + subContent + '</m:sub></m:sSub>';
      } else if (hasSup) {
        tok = '<m:sSup><m:e>' + tok + '</m:e><m:sup>' + supContent + '</m:sup></m:sSup>';
      }
      result.push(tok);
    }
    return result;
  }

  const inner = parseSequence(null).join('');
  if (isDisplay) return '<m:oMathPara><m:oMath>' + inner + '</m:oMath></m:oMathPara>';
  return '<m:oMath>' + inner + '</m:oMath>';
}

// Custom XmlComponent subclass that injects raw OOXML math XML during docx build
class saveaiMathXmlNode extends ix {
  constructor(rawXml) {
    super('__saveaiMath__');
    this._rawXml = rawXml;
  }
  prepForXml(ctx) {
    // Return the raw XML string as a special carrier
    // The docx Paragraph's prepForXml will include this in root[]
    return { __saveaiMathRaw: this._rawXml };
  }
}


// Inline math: returns a saveaiMathXmlNode
function saveaiInlineMathNode(latex) {
  return new saveaiMathXmlNode(saveaiLatexToOfficeMathXML(latex, false));
}

// === Patch the Px function to handle LaTeX math ===

function Px(t, e) {
  // Fast path: no $ signs means no math
  if (!t || t.indexOf('$') === -1) return _saveai_orig_Px(t, e);

  // Split on $$...$$ (display) and $...$ (inline) math delimiters
  const segments = [];
  let cur = '';
  let i = 0;
  while (i < t.length) {
    if (t[i] === '$' && t[i+1] === '$') {
      if (cur) { segments.push({ type: 'text', content: cur }); cur = ''; }
      i += 2;
      let mathContent = '';
      while (i < t.length && !(t[i] === '$' && t[i+1] === '$')) mathContent += t[i++];
      i += 2;
      if (mathContent.trim()) segments.push({ type: 'display', content: mathContent });
    } else if (t[i] === '$') {
      if (cur) { segments.push({ type: 'text', content: cur }); cur = ''; }
      i += 1;
      let mathContent = '';
      while (i < t.length && t[i] !== '$') mathContent += t[i++];
      i += 1;
      if (mathContent.trim()) segments.push({ type: 'inline', content: mathContent });
      else cur += '$' + mathContent + '$';
    } else {
      cur += t[i++];
    }
  }
  if (cur) segments.push({ type: 'text', content: cur });

  // Build result array
  const result = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      if (seg.content) {
        const textRuns = _saveai_orig_Px(seg.content, e);
        result.push(...textRuns);
      }
    } else {
      // Math segment
      try {
        if (seg.type === 'display') {
          // Display math: place on its own line by adding line breaks before and after
          result.push(new xr({ text: "\n", break: 1 }));
          result.push(saveaiInlineMathNode(seg.content));
          result.push(new xr({ text: "\n", break: 1 }));
        } else {
          result.push(saveaiInlineMathNode(seg.content));
        }
      } catch(err) {
        // Fallback: render as plain text
        const textRuns = _saveai_orig_Px('$' + seg.content + '$', e);
        result.push(...textRuns);
      }
    }
  }
  return result.length ? result : _saveai_orig_Px(t, e);
}

/* END SAVEAI LATEX MATH PATCH */

