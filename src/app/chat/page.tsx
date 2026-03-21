"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import SettingsModal, {
  getCredentials,
  hasAllCredentials,
  CREDENTIALS_UPDATED_EVENT,
} from "@/components/settings-modal";

import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import * as React from "react";

/**
 * Home page component that renders the Tambo chat interface.
 *
 * @remarks
 * The `NEXT_PUBLIC_TAMBO_URL` environment variable specifies the URL of the Tambo server.
 * You do not need to set it if you are using the default Tambo server.
 * It is only required if you are running the API server locally.
 *
 * @see {@link https://github.com/tambo-ai/tambo/blob/main/CONTRIBUTING.md} for instructions on running the API server locally.
 */
export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  const [credentialsReady, setCredentialsReady] = React.useState(false);
  const [tamboApiKey, setTamboApiKey] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  // Read credentials on mount & whenever they change
  const refreshCredentials = React.useCallback(() => {
    const creds = getCredentials();
    setTamboApiKey(creds.tamboApiKey);
    setCredentialsReady(hasAllCredentials());
  }, []);

  React.useEffect(() => {
    setMounted(true);
    refreshCredentials();
    window.addEventListener(CREDENTIALS_UPDATED_EVENT, refreshCredentials);
    return () =>
      window.removeEventListener(CREDENTIALS_UPDATED_EVENT, refreshCredentials);
  }, [refreshCredentials]);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="h-screen w-full relative">
      {/* Settings gear icon – always visible */}
      <SettingsModal />

      <div className="h-full w-full">
        {/* Credentials‐missing banner */}
        {!credentialsReady && (
          <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center px-4 py-3
                          bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 shadow-sm">
            <div className="flex items-center gap-3 max-w-2xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <p className="text-sm font-medium text-amber-800">
                Please add your credentials in{" "}
                <button
                  onClick={() =>
                    document.getElementById("settings-button")?.click()
                  }
                  className="underline font-bold hover:text-amber-900 transition-colors"
                >
                  Settings
                </button>{" "}
                to get started.
              </p>
            </div>
          </div>
        )}

        <TamboProvider
          apiKey={tamboApiKey || process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
          components={components}
          tools={tools}
          tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
          mcpServers={mcpServers}
        >
          <div className={`h-full ${!credentialsReady ? "pointer-events-none opacity-50 select-none" : ""}`}>
            <MessageThreadFull />
          </div>
        </TamboProvider>
      </div>
    </div>
  );
}
