package com.nodeseek.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import java.io.ByteArrayOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicBoolean;
import org.json.JSONObject;

public final class NodeseekUserscriptRuntime {
    private static final String BRIDGE_NAME = "NSXBridge";
    private static final String PREFS_NAME = "nsx_gm_storage";
    private static final String PREF_KEY_PREFIX = "gm_";
    private static final String SCRIPT_ASSET_PATH = "userscripts/nodeseek-pro.user.js";

    private static final String LAYUI_URL =
        "https://s4.zstatic.net/ajax/libs/layui/2.10.3/layui.min.js";
    private static final String HL_LIGHT_URL =
        "https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
    private static final String HL_DARK_URL =
        "https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";

    private static volatile String scriptBase64Cache;
    // WebView 采用 SwipeRefreshLayout 实现下拉刷新：其触发条件依赖 WebView 自身是否可向上滚动。
    // 当网页内部出现“独立滚动容器”（例如脚本设置面板）时，WebView 可能仍处于顶部，
    // 用户在面板内滑动会误触发下拉刷新。这里提供一个可由 JS Bridge 控制的全局开关用于临时抑制下拉刷新。
    private static final AtomicBoolean pullToRefreshSuppressed = new AtomicBoolean(false);

    private NodeseekUserscriptRuntime() {
    }

    static void setPullToRefreshSuppressed(boolean suppressed) {
        pullToRefreshSuppressed.set(suppressed);
    }

    static boolean isPullToRefreshSuppressed() {
        return pullToRefreshSuppressed.get();
    }

    public static void attach(Activity activity, WebView webView) {
        if (activity == null || webView == null) {
            return;
        }
        webView.addJavascriptInterface(new Bridge(activity.getApplicationContext()), BRIDGE_NAME);
    }

    public static void inject(Activity activity, WebView webView, String url) {
        if (activity == null || webView == null) {
            return;
        }
        if (!isSupportedHost(url)) {
            return;
        }
        String scriptBase64 = getScriptBase64(activity.getApplicationContext());
        if (scriptBase64 == null || scriptBase64.isEmpty()) {
            return;
        }
        String bootstrap = buildBootstrapScript(scriptBase64);
        webView.evaluateJavascript(bootstrap, null);
    }

    private static boolean isSupportedHost(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        Uri uri = Uri.parse(url);
        String host = uri.getHost();
        if (host == null) {
            return false;
        }
        String lowerHost = host.toLowerCase(Locale.ROOT);
        return "www.nodeseek.com".equals(lowerHost)
            || "nodeseek.com".equals(lowerHost)
            || "www.deepflood.com".equals(lowerHost)
            || "deepflood.com".equals(lowerHost);
    }

    private static String getScriptBase64(Context context) {
        String cached = scriptBase64Cache;
        if (cached != null) {
            return cached;
        }
        synchronized (NodeseekUserscriptRuntime.class) {
            if (scriptBase64Cache != null) {
                return scriptBase64Cache;
            }
            String script = readUserscriptText(context);
            if (script == null || script.isEmpty()) {
                scriptBase64Cache = "";
                return scriptBase64Cache;
            }
            scriptBase64Cache = Base64.encodeToString(
                script.getBytes(StandardCharsets.UTF_8),
                Base64.NO_WRAP
            );
            return scriptBase64Cache;
        }
    }

    private static String readUserscriptText(Context context) {
        return readAssetText(context, SCRIPT_ASSET_PATH);
    }

    private static String readAssetText(Context context, String path) {
        try (InputStream inputStream = context.getAssets().open(path);
             InputStreamReader inputStreamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
             BufferedReader bufferedReader = new BufferedReader(inputStreamReader)) {
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                builder.append(line).append('\n');
            }
            return builder.toString();
        } catch (IOException ignored) {
            return "";
        }
    }

    private static String buildBootstrapScript(String scriptBase64) {
        return "(function(){"
            + "try{"
            + "var hn=(location.hostname||location.host||'').toLowerCase();"
            + "if(!(hn==='www.nodeseek.com'||hn==='nodeseek.com'||hn==='www.deepflood.com'||hn==='deepflood.com')){return;}"
            + "if(window.__NSX_APP_BOOTSTRAPPED__){return;}"
            + "window.__NSX_APP_BOOTSTRAPPED__=true;"
            + "var LAYUI_URL='" + escapeJs(LAYUI_URL) + "';"
            + "var SCRIPT_B64='" + scriptBase64 + "';"
            + "var RESOURCE_MAP={"
            + "'highlightStyle':'" + escapeJs(HL_LIGHT_URL) + "',"
            + "'highlightStyle_dark':'" + escapeJs(HL_DARK_URL) + "'"
            + "};"
            + "function decodeBase64Utf8(b64){"
            + "try{return decodeURIComponent(escape(atob(b64)));}"
            + "catch(e){try{return atob(b64);}catch(_){return '';}}"
            + "}"
            + "function ensureLocalStorage(){"
            + "try{var t='__nsx_test__';localStorage.setItem(t,'1');localStorage.removeItem(t);return true;}"
            + "catch(e){return false;}"
            + "}"
            + "function storageKey(k){return '__nsx_gm__'+String(k||'');}"
            + "function gmGetValue(k,def){"
            + "try{if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".getValue){"
            + "var raw=" + BRIDGE_NAME + ".getValue(String(k));"
            + "if(raw!==null&&raw!==undefined&&raw!==''){return JSON.parse(raw);}"
            + "return def;}}catch(e){}"
            + "if(ensureLocalStorage()){"
            + "var v=localStorage.getItem(storageKey(k));"
            + "if(v===null||v===undefined||v===''){return def;}"
            + "try{return JSON.parse(v);}catch(e){return def;}"
            + "}"
            + "return def;"
            + "}"
            + "function gmSetValue(k,v){"
            + "try{var raw=JSON.stringify(v);"
            + "if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".setValue){" + BRIDGE_NAME + ".setValue(String(k),raw);return;}"
            + "if(ensureLocalStorage()){localStorage.setItem(storageKey(k),raw);}}catch(e){}"
            + "}"
            + "function gmDeleteValue(k){"
            + "try{if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".deleteValue){" + BRIDGE_NAME + ".deleteValue(String(k));return;}}catch(e){}"
            + "try{if(ensureLocalStorage()){localStorage.removeItem(storageKey(k));}}catch(e){}"
            + "}"
            + "function gmNotify(text,title){"
            + "try{if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".notify){" + BRIDGE_NAME + ".notify(String(title||''),String(text||''));return;}}catch(e){}"
            + "console.info('[NSX notify]',title||'',text||'');"
            + "}"
            + "function gmOpenInTab(url){"
            + "try{if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".openExternal){" + BRIDGE_NAME + ".openExternal(String(url||''));return;}}catch(e){}"
            + "try{window.open(url,'_blank');}catch(e){}"
            + "}"
            + "function gmAddStyle(css){"
            + "var el=document.createElement('style');"
            + "el.textContent=String(css||'');"
            + "(document.head||document.documentElement).appendChild(el);"
            + "return el;"
            + "}"
            + "function gmAddElement(a,b,c){"
            + "var parent=document.head||document.documentElement;"
            + "var tag='div';"
            + "var attrs={};"
            + "if(typeof a==='string'){tag=a;attrs=b||{};}"
            + "else{parent=a||parent;tag=b||'div';attrs=c||{};}"
            + "var el=document.createElement(tag);"
            + "Object.keys(attrs||{}).forEach(function(k){"
            + "if(k==='textContent'){el.textContent=attrs[k];}"
            + "else if(k==='innerHTML'){el.innerHTML=attrs[k];}"
            + "else{el.setAttribute(k,String(attrs[k]));}"
            + "});"
            + "parent.appendChild(el);"
            + "return el;"
            + "}"
            + "function normalizeHeaders(headers){"
            + "var out={};"
            + "Object.keys(headers||{}).forEach(function(k){out[k]=String(headers[k]);});"
            + "return out;"
            + "}"
            + "function toBase64FromBuffer(buffer){"
            + "var bytes=new Uint8Array(buffer||new ArrayBuffer(0));"
            + "var chunkSize=0x8000;"
            + "var chunks=[];"
            + "for(var i=0;i<bytes.length;i+=chunkSize){"
            + "chunks.push(String.fromCharCode.apply(null,bytes.subarray(i,i+chunkSize)));"
            + "}"
            + "return btoa(chunks.join(''));"
            + "}"
            + "function parseResponseData(xhr,responseType){"
            + "if(responseType==='json'){"
            + "try{return JSON.parse(xhr.responseText||'null');}catch(e){return null;}"
            + "}"
            + "if(responseType==='arraybuffer'){"
            + "try{"
            + "if(!xhr.responseBase64){return new ArrayBuffer(0);}"
            + "var bin=atob(xhr.responseBase64);"
            + "var out=new Uint8Array(bin.length);"
            + "for(var i=0;i<bin.length;i++){out[i]=bin.charCodeAt(i);}"
            + "return out.buffer;"
            + "}catch(e){return new ArrayBuffer(0);}"
            + "}"
            + "if(responseType==='blob'){"
            + "try{return new Blob([xhr.responseText||'']);}catch(e){return null;}"
            + "}"
            + "return xhr.responseText||'';"
            + "}"
            + "function buildXhrResponse(raw,responseType){"
            + "var xhr={"
            + "status:Number(raw.status||0),"
            + "statusText:raw.statusText||'',"
            + "responseText:raw.responseText||'',"
            + "responseHeaders:raw.responseHeaders||'',"
            + "finalUrl:raw.finalUrl||'',"
            + "responseBase64:raw.responseBase64||''"
            + "};"
            + "xhr.response=parseResponseData(xhr,responseType);"
            + "return xhr;"
            + "}"
            + "function shouldUseBridge(details){"
            + "if(!(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".httpRequest)){return false;}"
            + "var data=details.data;"
            + "if(data===undefined||data===null){return true;}"
            + "if(typeof data==='string'){return true;}"
            + "if(data instanceof URLSearchParams){return true;}"
            + "if(data instanceof FormData){return true;}"
            + "if(typeof Blob!=='undefined'&&data instanceof Blob){return true;}"
            + "if(data instanceof ArrayBuffer){return true;}"
            + "if(ArrayBuffer.isView&&ArrayBuffer.isView(data)){return true;}"
            + "try{JSON.stringify(data);return true;}catch(e){return false;}"
            + "}"
            + "async function buildBodyPayload(details,headers){"
            + "var data=details.data;"
            + "if(data===undefined||data===null){return {data:null,bodyBase64:null};}"
            + "if(typeof data==='string'){return {data:data,bodyBase64:null};}"
            + "if(data instanceof URLSearchParams){"
            + "if(!headers['Content-Type']&&!headers['content-type']){headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';}"
            + "return {data:data.toString(),bodyBase64:null};"
            + "}"
            + "if(data instanceof FormData){"
            + "var req=new Request(location.href,{method:'POST',body:data});"
            + "var contentType=req.headers.get('content-type');"
            + "if(contentType&&!headers['Content-Type']&&!headers['content-type']){headers['Content-Type']=contentType;}"
            + "return {data:null,bodyBase64:toBase64FromBuffer(await req.arrayBuffer())};"
            + "}"
            + "if(typeof Blob!=='undefined'&&data instanceof Blob){"
            + "return {data:null,bodyBase64:toBase64FromBuffer(await data.arrayBuffer())};"
            + "}"
            + "if(data instanceof ArrayBuffer){return {data:null,bodyBase64:toBase64FromBuffer(data)};}"
            + "if(ArrayBuffer.isView&&ArrayBuffer.isView(data)){return {data:null,bodyBase64:toBase64FromBuffer(data.buffer)};}"
            + "try{return {data:JSON.stringify(data),bodyBase64:null};}catch(e){return {data:String(data),bodyBase64:null};}"
            + "}"
            + "function requestViaBridge(details,onOk,onErr){"
            + "Promise.resolve().then(async function(){"
            + "var headers=normalizeHeaders(details.headers||{});"
            + "var payload=await buildBodyPayload(details,headers);"
            + "var req={"
            + "method:(details.method||'GET'),"
            + "url:details.url||'',"
            + "headers:headers,"
            + "data:payload.data,"
            + "bodyBase64:payload.bodyBase64,"
            + "timeout:Number(details.timeout||0),"
            + "withCredentials:!!details.withCredentials"
            + "};"
            + "var raw=" + BRIDGE_NAME + ".httpRequest(JSON.stringify(req));"
            + "var res={};"
            + "try{res=JSON.parse(raw||'{}');}catch(e){res={networkError:true,error:'Invalid response'};}"
            + "if(res.networkError){throw new Error(res.error||'Network error');}"
            + "onOk(buildXhrResponse(res,String(details.responseType||'').toLowerCase()));"
            + "}).catch(onErr);"
            + "}"
            + "function requestViaFetch(details,onOk,onErr){"
            + "try{"
            + "var method=String(details.method||'GET').toUpperCase();"
            + "var fetchHeaders=normalizeHeaders(details.headers||{});"
            + "var fetchOptions={"
            + "method:method,"
            + "headers:fetchHeaders,"
            + "credentials:details.withCredentials?'include':'same-origin'"
            + "};"
            + "if(details.data!==undefined&&details.data!==null&&method!=='GET'&&method!=='HEAD'){fetchOptions.body=details.data;}"
            + "fetch(details.url,fetchOptions).then(function(resp){"
            + "return resp.text().then(function(text){"
            + "var raw={status:resp.status,statusText:resp.statusText||'',responseText:text||'',responseHeaders:'',finalUrl:resp.url||details.url||'',responseBase64:''};"
            + "onOk(buildXhrResponse(raw,String(details.responseType||'').toLowerCase()));"
            + "});"
            + "}).catch(onErr);"
            + "}catch(err){onErr(err);}"
            + "}"
            + "function gmXhr(details){"
            + "details=details||{};"
            + "return new Promise(function(resolve,reject){"
            + "function onOk(xhr){"
            + "try{if(typeof details.onload==='function'){details.onload(xhr);}}catch(e){}"
            + "try{if(typeof details.onloadend==='function'){details.onloadend(xhr);}}catch(e){}"
            + "resolve(xhr);"
            + "}"
            + "function onErr(err){"
            + "var normalizedErr=err instanceof Error?err:new Error(String(err||'Network error'));"
            + "try{if(typeof details.onerror==='function'){details.onerror(normalizedErr);}}catch(e){}"
            + "try{if(typeof details.onloadend==='function'){details.onloadend(normalizedErr);}}catch(e){}"
            + "reject(normalizedErr);"
            + "}"
            + "if(shouldUseBridge(details)){requestViaBridge(details,onOk,onErr);return;}"
            + "requestViaFetch(details,onOk,onErr);"
            + "});"
            + "}"
            + "function evalScript(code,name){"
            + "if(!code){throw new Error('empty script:'+name);}"
            + "var src=String(code)+'\\n//# sourceURL='+(name||'nsx-runtime.js');"
            + "try{(0,eval)(src);return;}catch(e){}"
            + "try{(new Function(src))();return;}catch(e2){throw e2;}"
            + "}"
            + "function loadScript(url){"
            + "return new Promise(function(resolve,reject){"
            + "if(!url){resolve();return;}"
            + "var done=false;"
            + "window.__NSX_APP_LOADED__=window.__NSX_APP_LOADED__||{};"
            + "if(window.__NSX_APP_LOADED__[url]){resolve();return;}"
            + "function ok(){if(done){return;} done=true; window.__NSX_APP_LOADED__[url]=true; resolve();}"
            + "function fail(err){if(done){return;} done=true; reject(err);}"
            + "function tryBridge(fallback){"
            + "try{"
            + "if(!(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".httpRequest)){throw new Error('bridge unavailable');}"
            + "var raw=" + BRIDGE_NAME + ".httpRequest(JSON.stringify({method:'GET',url:url,headers:{},data:null,timeout:15000,withCredentials:false}));"
            + "var res={};"
            + "try{res=JSON.parse(raw||'{}');}catch(e){res={networkError:true,error:'invalid bridge response'};}"
            + "if(res.networkError){throw new Error(res.error||'bridge request failed');}"
            + "evalScript(res.responseText||'',url);"
            + "ok();"
            + "}catch(err){"
            + "if(typeof fallback==='function'){fallback(err);return;}"
            + "fail(err);"
            + "}"
            + "}"
            + "function tryTag(prevErr){"
            + "try{"
            + "var s=document.createElement('script');"
            + "s.src=url;"
            + "s.async=false;"
            + "s.setAttribute('data-nsx-src',url);"
            + "s.onload=ok;"
            + "s.onerror=function(){tryBridge(function(){fail(prevErr||new Error('script load failed'));});};"
            + "(document.head||document.documentElement).appendChild(s);"
            + "}catch(e){fail(prevErr||e);}"
            + "}"
            + "if(window." + BRIDGE_NAME + "&&" + BRIDGE_NAME + ".httpRequest){tryBridge(function(err){tryTag(err);});return;}"
            + "tryTag(null);"
            + "});"
            + "}"
            + "window.GM_info=window.GM_info||{script:{name:'Nodeseek Pro',version:'1.0.0'}};"
            + "window.unsafeWindow=window;"
            + "window.GM_getValue=gmGetValue;"
            + "window.GM_setValue=gmSetValue;"
            + "window.GM_deleteValue=gmDeleteValue;"
            + "window.GM_notification=gmNotify;"
            + "window.GM_registerMenuCommand=window.GM_registerMenuCommand||function(){window.__nsxMenuSeq=(window.__nsxMenuSeq||0)+1;return window.__nsxMenuSeq;};"
            + "window.GM_unregisterMenuCommand=window.GM_unregisterMenuCommand||function(){};"
            + "window.GM_getResourceURL=function(name){return RESOURCE_MAP[name]||'';};"
            + "window.GM_addElement=gmAddElement;"
            + "window.GM_addStyle=gmAddStyle;"
            + "window.GM_openInTab=gmOpenInTab;"
            + "window.GM_xmlhttpRequest=gmXhr;"
            + "function runUserscript(){"
            + "if(window.__NSX_APP_USERSCRIPT_RUNNING__){return;}"
            + "window.__NSX_APP_USERSCRIPT_RUNNING__=true;"
            + "var code=decodeBase64Utf8(SCRIPT_B64);"
            + "if(!code){console.error('[NSX] userscript empty');return;}"
            + "evalScript(code,'nodeseek-pro.user.js');"
            + "}"
            + "loadScript(LAYUI_URL).catch(function(err){console.warn('[NSX] require failed',err);}).finally(runUserscript);"
            + "}catch(err){console.error('[NSX] bootstrap error',err);}"
            + "})();";
    }

    private static String escapeJs(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace("\n", "\\n")
            .replace("\r", "");
    }

    private static final class Bridge {
        private final Context appContext;
        private final SharedPreferences prefs;
        private final Handler mainHandler = new Handler(Looper.getMainLooper());
        private final String defaultUserAgent;

        Bridge(Context context) {
            this.appContext = context;
            this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            this.defaultUserAgent = resolveDefaultUserAgent(context);
        }

        private String resolveDefaultUserAgent(Context context) {
            try {
                return WebSettings.getDefaultUserAgent(context);
            } catch (Exception ignored) {
                return System.getProperty("http.agent", "");
            }
        }

        @JavascriptInterface
        public String getValue(String key) {
            if (key == null) {
                return null;
            }
            return prefs.getString(PREF_KEY_PREFIX + key, null);
        }

        @JavascriptInterface
        public void setValue(String key, String rawJson) {
            if (key == null) {
                return;
            }
            prefs.edit().putString(PREF_KEY_PREFIX + key, rawJson == null ? "null" : rawJson).apply();
        }

        @JavascriptInterface
        public void deleteValue(String key) {
            if (key == null) {
                return;
            }
            prefs.edit().remove(PREF_KEY_PREFIX + key).apply();
        }

        @JavascriptInterface
        public void notify(String title, String text) {
            String message = (title == null ? "" : title.trim());
            if (text != null && !text.trim().isEmpty()) {
                if (!message.isEmpty()) {
                    message += "：";
                }
                message += text.trim();
            }
            if (message.isEmpty()) {
                return;
            }
            String finalMessage = message;
            mainHandler.post(() -> Toast.makeText(appContext, finalMessage, Toast.LENGTH_SHORT).show());
        }

        @JavascriptInterface
        public void openExternal(String url) {
            if (url == null || url.trim().isEmpty()) {
                return;
            }
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                appContext.startActivity(intent);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void setPullToRefreshSuppressed(boolean suppressed) {
            NodeseekUserscriptRuntime.setPullToRefreshSuppressed(suppressed);
        }

        @JavascriptInterface
        public String httpRequest(String requestJson) {
            JSONObject result = new JSONObject();
            HttpURLConnection connection = null;
            try {
                JSONObject request = new JSONObject(requestJson == null ? "{}" : requestJson);
                String method = request.optString("method", "GET").trim().toUpperCase(Locale.ROOT);
                String urlText = request.optString("url", "").trim();
                if (urlText.isEmpty()) {
                    result.put("networkError", true);
                    result.put("error", "URL is empty");
                    return result.toString();
                }
                URL url = new URL(urlText);
                String protocol = url.getProtocol();
                if (!"http".equalsIgnoreCase(protocol) && !"https".equalsIgnoreCase(protocol)) {
                    result.put("networkError", true);
                    result.put("error", "Unsupported protocol");
                    return result.toString();
                }

                connection = (HttpURLConnection) url.openConnection();
                int timeout = request.optInt("timeout", 15000);
                if (timeout <= 0) {
                    timeout = 15000;
                }
                connection.setConnectTimeout(timeout);
                connection.setReadTimeout(timeout);
                connection.setRequestMethod(method);
                connection.setUseCaches(false);
                connection.setInstanceFollowRedirects(true);

                boolean withCredentials = request.optBoolean("withCredentials", false);
                if (withCredentials) {
                    String cookie = CookieManager.getInstance().getCookie(urlText);
                    if (cookie != null && !cookie.trim().isEmpty()) {
                        connection.setRequestProperty("Cookie", cookie);
                    }
                }

                JSONObject headers = request.optJSONObject("headers");
                boolean hasUserAgent = false;
                if (headers != null) {
                    Iterator<String> headerNames = headers.keys();
                    while (headerNames.hasNext()) {
                        String name = headerNames.next();
                        if (name != null && "user-agent".equalsIgnoreCase(name)) {
                            hasUserAgent = true;
                        }
                        Object value = headers.opt(name);
                        if (value != null) {
                            connection.setRequestProperty(name, String.valueOf(value));
                        }
                    }
                }
                if (!hasUserAgent && defaultUserAgent != null && !defaultUserAgent.trim().isEmpty()) {
                    connection.setRequestProperty("User-Agent", defaultUserAgent);
                }

                byte[] requestBody = null;
                if (request.has("bodyBase64") && !request.isNull("bodyBase64")) {
                    String bodyBase64 = request.optString("bodyBase64", "");
                    if (!bodyBase64.isEmpty()) {
                        requestBody = Base64.decode(bodyBase64, Base64.DEFAULT);
                    }
                } else if (request.has("data") && !request.isNull("data")) {
                    requestBody = request.optString("data", "").getBytes(StandardCharsets.UTF_8);
                }

                if (requestBody != null && !"GET".equals(method) && !"HEAD".equals(method)) {
                    connection.setDoOutput(true);
                    try (OutputStream outputStream = connection.getOutputStream()) {
                        outputStream.write(requestBody);
                        outputStream.flush();
                    }
                }

                int status = connection.getResponseCode();
                String statusText = connection.getResponseMessage();
                InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
                byte[] responseBytes = readBytes(stream);
                String responseText = new String(responseBytes, StandardCharsets.UTF_8);
                String responseBase64 = Base64.encodeToString(responseBytes, Base64.NO_WRAP);
                String responseHeaders = flattenHeaders(connection.getHeaderFields());
                String finalUrl = connection.getURL() == null ? urlText : connection.getURL().toString();

                if (withCredentials) {
                    List<String> setCookieValues = connection.getHeaderFields().get("Set-Cookie");
                    if (setCookieValues != null) {
                        CookieManager cookieManager = CookieManager.getInstance();
                        for (String setCookie : setCookieValues) {
                            if (setCookie != null && !setCookie.trim().isEmpty()) {
                                cookieManager.setCookie(finalUrl, setCookie);
                            }
                        }
                    }
                }

                result.put("networkError", false);
                result.put("status", status);
                result.put("statusText", statusText == null ? "" : statusText);
                result.put("responseText", responseText == null ? "" : responseText);
                result.put("responseBase64", responseBase64);
                result.put("responseHeaders", responseHeaders);
                result.put("finalUrl", finalUrl);
                return result.toString();
            } catch (Exception ex) {
                try {
                    result.put("networkError", true);
                    result.put("error", ex.getMessage() == null ? "Request failed" : ex.getMessage());
                } catch (Exception ignored) {
                    return "{\"networkError\":true,\"error\":\"Request failed\"}";
                }
                return result.toString();
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }

        private byte[] readBytes(InputStream inputStream) throws IOException {
            if (inputStream == null) {
                return new byte[0];
            }
            try (InputStream stream = inputStream;
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[8192];
                int readLength;
                while ((readLength = stream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, readLength);
                }
                return outputStream.toByteArray();
            }
        }

        private String flattenHeaders(Map<String, List<String>> headerFields) {
            if (headerFields == null || headerFields.isEmpty()) {
                return "";
            }
            StringBuilder builder = new StringBuilder();
            for (Map.Entry<String, List<String>> entry : headerFields.entrySet()) {
                String name = entry.getKey();
                if (name == null) {
                    continue;
                }
                List<String> values = entry.getValue();
                if (values == null || values.isEmpty()) {
                    continue;
                }
                for (String value : values) {
                    builder.append(name).append(": ").append(value == null ? "" : value).append('\n');
                }
            }
            return builder.toString();
        }
    }
}
