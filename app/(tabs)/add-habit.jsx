import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const FREQUENCIES = ["daily", "weekly", "monthly"];

export default function AddHabit() {
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

        <TextInput label="Title" mode="outlined" style={styles.input} />
        <TextInput label="Description" mode="outlined" style={styles.input} />

        <SegmentedButtons
          buttons={FREQUENCIES.map((item) => ({
            value: item,
            label: item.charAt(0).toUpperCase() + item.slice(1)
          }))}
          style={styles.segmentedButton}
        />

        <View style={styles.buttonWrapper}>
          <Button mode="contained" style={styles.addHabitButton}>
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