import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { useAuth } from '../../lib/auth-context';
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '../../lib/appwrite';
import { ID } from 'react-native-appwrite';
import { router } from 'expo-router';

const FREQUENCIES = ["daily", "weekly", "monthly"];

export default function AddHabit() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frquency, setFrequency] = useState("daily");
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      if (!user) {
        return;
      }

      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency: frquency,
          steak_count: 0,
          last_completed: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
      );

      setTitle("");
      setDescription("");
      setFrequency("daily");

      router.back();
    } catch (error) {
      console.log("Error in create new habit: ", error.message);
      Alert.alert("Error", "Error to create new habit.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/create_screen_logo.jpg')}
          transition={200}
          contentFit='cover'
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
            borderRadius: 25,
            marginTop: 10
          }} />
      </View>
      <View style={styles.inner}>

        <TextInput label="Title" mode="outlined" style={styles.input} onChangeText={setTitle} />
        <TextInput label="Description" mode="outlined" style={styles.input} onChangeText={setDescription} />

        <SegmentedButtons
          buttons={FREQUENCIES.map((item) => ({
            value: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
          }))}
          style={styles.segmentedButton}
          onValueChange={(value) => setFrequency(value)}
          value={frquency}
        />


        <View style={styles.buttonWrapper}>
          <Button mode="contained"
            style={styles.addHabitButton}
            disabled={!title || !description}
            onPress={handleSubmit}
          >
            Add Habit
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  buttonWrapper: {
    position: 'absolute',
    right: 16,
    top: 226,
  },
  addHabitButton: {
    borderColor: 'black',
    borderWidth: 1.6,
    borderRadius: 10,
    backgroundColor: 'coral',
    width: 180
  },
  imageContainer: {
    // borderColor: 'red',
    // borderWidth: 2,
  }
});