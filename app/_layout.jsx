import { Stack, useRouter, useSegments } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { ReactNode, useEffect } from "react";

import { AuthProvider, useAuth, isLoadingUser } from '../lib/auth-context';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
