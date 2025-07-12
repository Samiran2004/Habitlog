import { Stack, useRouter, useSegments } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from '../lib/auth-context';

function RouteGuard({ children }) {
  const router = useRouter();

  const { user } = useAuth();

  const segments = useSegments();

  useEffect(() => {
    const inAuthScreen = segments[0] === 'auth';
    if (!user && !inAuthScreen) {
      setTimeout(() => {
        router.replace("/auth");
      }, 0);
    } else if (user && inAuthScreen) {
      router.replace("/");
    }
  }, [user, segments]);

  return <>{children}</>;
}


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <SafeAreaProvider>
          <RouteGuard>
            <GluestackUIProvider mode="light">

              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>

            </GluestackUIProvider>
          </RouteGuard>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
