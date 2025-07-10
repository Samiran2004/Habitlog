import { Button } from "@/components/ui/button";
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
// import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack";

export default function Index() {

  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(habits);

  const fetchHabits = async () => {
    try {

      setIsLoading(true);

      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [
          Query.equal("user_id", user?.$id)
        ]
      );

      setHabits(response.documents);

    } catch (error) {
      console.log("Error in fetch habits: ", error.message);
      Alert.alert("Error", "Error in fetch habits!");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [user]);

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Button onPress={signOut} style={styles.signOutButton}>
          <Text style={{ color: 'white' }}>SignOut</Text>
        </Button>
      </View>

      {/* List of Habits */}
      {
        habits.length === 0 || isLoading === true ? (
          <LoaderSkeleton />
        ) : (
          habits.map((habit, key) => (
            <View key={habit.$id || key}>
              {/* <Text>{habit.description}</Text> */}
              <HabitCard habitProp={habit} />
            </View>
          ))
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // borderWidth: 2,
    // borderColor: 'red',
    position: 'fixed',
    right: -150,
    margin: 10,
    zIndex: 99,
  },
  signOutButton: {
    borderRadius: 12,
    height: 42
  },
  habitCard: {
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5
  }
});

function LoaderSkeleton() {
  return (
    <Box className="w-[90%] gap-4 p-3 rounded-md bg-background-100">
      <Skeleton variant="sharp" className="h-[150px]" />
      <SkeletonText _lines={3} className="h-3" />
      <HStack className="gap-2 align-middle">
        <Skeleton variant="circular" className="h-[24px] w-[24px] mr-2" />
        <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
      </HStack>
    </Box>
  )
}

function HabitCard({ habitProp }) {
  return (
    <Card className="p-5 rounded-lg w-[360px] m-3" style={styles.habitCard}>
      <Text className="text-sm font-normal mb-2 text-typography-700">
        May 15, 2023
      </Text>
      <VStack className="mb-6">
        <Heading size="md" className="mb-4">
          {/* The Power of Positive Thinking */}
          {habitProp.title}
        </Heading>
        <Text size="sm">
          {habitProp.description}
        </Text>
      </VStack>
      <Box className="flex-row">
        <Avatar className="mr-3" style={{ backgroundColor: 'white' }}>
          <AvatarFallbackText>H</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://img.icons8.com/?size=100&id=houGsYyNpCbu&format=png&color=000000",
            }}
            alt="image"
          />
        </Avatar>
        <VStack>
          <Heading size="sm" className="mb-1">
            Frequency: {habitProp.frequency}
          </Heading>
          <Text size="sm" style={{
            backgroundColor: '#ff3e0',
            textAlign: 'center',
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            color: '#ff9800'
          }}>Steak: {habitProp.steak_count}</Text>
        </VStack>
      </Box>
    </Card>
  )
}