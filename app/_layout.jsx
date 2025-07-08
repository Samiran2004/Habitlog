import { Stack, useRouter } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { ReactNode, useEffect } from "react";

function RouteGuard({ children }) {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      setTimeout(() => {
        router.replace("/auth");
      }, 0);
    }
  }, []);

  return <>{children}</>;
}


export default function RootLayout() {
  return <RouteGuard><GluestackUIProvider mode="light">

    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>

  </GluestackUIProvider></RouteGuard>;
}
