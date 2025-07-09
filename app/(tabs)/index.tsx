import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {

  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button onPress={signOut}>
        <Text style={{ color: 'white' }}>SignOut</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'coral',
    borderRadius: 10,
    textAlign: 'center',
    width: 100,
    height: 50,
  }
})