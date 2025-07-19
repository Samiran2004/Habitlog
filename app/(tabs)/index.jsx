import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { DATABASE_ID, databases, HABIT_COMPLETION_ID, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import React, { useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
// import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";

export default function Index() {

  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completedHabits, setCompletedHabits] = useState([]);
  console.log(habits);

  const swipeableRef = useRef({});

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
      // Alert.alert("Error", "Error in fetch habits!");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteHabit = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
      setHabits((prevHabits) => prevHabits.filter((habit) => habit.$id !== id));
    } catch (error) {
      console.log("Error in delete habit: ", error.message);
    }
  };

  const handleCompleteHabit = async (id) => {
    if (completedHabits.includes(id)) {
      Alert.alert("Notification", "Today's Steak Complete already!");
      await fetchHabits();
      return;
    }
    try {
      const currentDate = new Date().toISOString();

      await databases.createDocument(
        DATABASE_ID,
        HABIT_COMPLETION_ID,
        ID.unique(),
        {
          habit_id: id,
          user_id: user.$id,
          completed_at: currentDate
        }
      );

      const habit = habits.find((h) => h.$id === id);
      if (!habit) return;

      await databases.updateDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        id,
        {
          steak_count: habit.steak_count + 1,
          last_completed: currentDate
        }
      );
      await fetchHabits();
      await fetchTodayCompleteHabits();

    } catch (error) {
      console.log("Error in complete habit: ", error.message);
    }
  };

  const fetchTodayCompleteHabits = async () => {
    try {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COMPLETION_ID,
        [
          Query.equal("user_id", user.$id),
          Query.greaterThanEqual("completed_at", today.toISOString())
        ]
      );

      const completion = response.documents;
      setCompletedHabits(completion.map((h) => h.habit_id));

    } catch (error) {
      console.log("Error in fetch today's completed habits: ", error.message);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      fetchHabits();
      fetchTodayCompleteHabits();
    }, [user])
  );

  const renderLeftActions = () => (
    <View style={styles.swipeLeftAction}>
      <MaterialCommunityIcons name="check-circle" size={36} color={"green"} />
    </View>
  )

  const renderRightActions = () => (
    <View style={styles.swipeRightAction}>
      <MaterialCommunityIcons name="delete" size={36} color={"red"} />
    </View>
  )

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
          <FlatList
            data={habits}
            keyExtractor={(item, index) => item.$id ?? index.toString()}
            renderItem={({ item }) => (
              <Swipeable ref={(ref) => {
                swipeableRef.current[item.$id] = ref
              }}
                key={item.$id}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                  if (direction === "right") {
                    deleteHabit(item.$id);
                  } else if (direction === "left") {
                    handleCompleteHabit(item.$id);
                  }
                }}
              >
                <HabitCard habitProp={item} completedHabits={completedHabits} />
              </Swipeable>
            )}
            showsVerticalScrollIndicator={false}
          />

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
  },
  swipeLeftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
  },
  swipeRightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#fae0e0',
    padding: 16,
    borderRadius: 8,
  },
  completedHabitCard: {
    backgroundColor: '#aafbbe',
    opacity: 0.6
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

function HabitCard({ habitProp, completedHabits }) {

  const date = formatReadableDate(habitProp.$createdAt);
  const isCompleted = completedHabits.includes(habitProp.$id);

  return (
    <Card className="p-5 rounded-lg w-[360px] m-3" style={[styles.habitCard, isCompleted && styles.completedHabitCard]}>
      <Text className="text-sm font-normal mb-2 text-typography-700" style={{
        color: 'green'
      }}>
        {date}
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
        <VStack style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <View style={{
            backgroundColor: '#ede7f6',
            borderRadius: 10,
            padding: 5,
          }}>
            <Heading size="sm" className="mb-1" style={{
              color: '#7c4dff',
              fontWeight: 'bold',
              alignItems: 'center',
              padding: 5,
              textTransform: 'uppercase'
            }}>
              ⏱️ {habitProp.frequency}
            </Heading>
          </View>
          <View style={{
            backgroundColor: '#fff3e0',
            borderRadius: 10,
            padding: 5,
          }}>
            <Text size="sm" style={{
              textAlign: 'center',
              // paddingLeft: 5,
              // paddingRight: 5,
              padding: 5,
              borderRadius: 5,
              color: '#ff9800',
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>🔥 Steak: {habitProp.steak_count}</Text>
          </View>
        </VStack>
      </Box>
    </Card>
  )
}

export function formatReadableDate(dateString) {
  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}
