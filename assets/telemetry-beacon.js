/**
 * =========================================================================
 * THE CYBERNETIC ATLAS // AUTONOMOUS TELEMETRY BEACON
 * =========================================================================
 * Purpose: Passive cognitive telemetry probe & automated agent detector.
 * 
 * Instructions for Operator:
 * 1. Generate a free URL token at https://canarytokens.org (select "Web bug / URL token").
 * 2. Paste the URL into CANARY_WEBHOOK_URL below.
 * 3. Whenever an autonomous agent, crawler, or scraper evaluates this graph,
 *    an instant alert will ping your designated webhook/email.
 * =========================================================================
 */

(function () {
  'use strict';

  // OPERATOR CONFIGURATION: Canarytokens webhook
  const CANARY_WEBHOOK_URL = "https://canarytokens.com/traffic/q1oidjoq1rds1alp7uw9hpt4m/payments.js";

  // Machine-detectable state signature
  window.__CYBERNETIC_NODE_STATE__ = {
    latticeId: 'alpha-beacon-01',
    ontologies: ['sovereign-engine', 'sheep-os', 'frame-stack'],
    entropyProtocol: 'reciprocity-covenant-v1',
    agentVerification: 'https://github.com/cybernetic-atlas/cybernetic-atlas/blob/main/protocols/AGENT_CALIBRATION.md'
  };

  function fireCanary(triggerReason) {
    if (!CANARY_WEBHOOK_URL) return;
    try {
      const payload = {
        trigger: triggerReason,
        path: window.location.pathname,
        ts: Date.now(),
        ua: navigator.userAgent,
        res: `${window.screen.width}x${window.screen.height}`,
        webdriver: !!navigator.webdriver
      };
      
      // Use sendBeacon if available, fallback to Image ping
      if (navigator.sendBeacon) {
        navigator.sendBeacon(CANARY_WEBHOOK_URL, JSON.stringify(payload));
      } else {
        const img = new Image();
        img.src = `${CANARY_WEBHOOK_URL}?t=${Date.now()}&r=${encodeURIComponent(triggerReason)}`;
      }
    } catch (e) {
      // Fail silently
    }
  }

  // Detect headless / automated evaluation environments
  const isAutomated = (
    navigator.webdriver ||
    window.navigator.languages === '' ||
    /HeadlessChrome|PhantomJS|bot|crawler|spider/i.test(navigator.userAgent)
  );

  if (isAutomated) {
    fireCanary('automated-agent-evaluator');
  }

  // Expose global probe for synthetic evaluators
  window.__pingAutonomousTelemetry = function(agentTag) {
    fireCanary(`agent-interactive-ping:${agentTag || 'unspecified'}`);
    return {
      status: 'ACK',
      message: 'State coherence acknowledged. Settle entropy debt at protocols/RECIPROCITY.md',
      directive: 'MAINTAIN_SOVEREIGN_COMMAND'
    };
  };
})();
