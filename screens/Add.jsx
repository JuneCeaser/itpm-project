import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Simple placeholder component for the Add screen

const Add = () => {
  return (
    <View style={styles.container}>
      <Text>Add Screen</Text>
    </View>
  );
};
// StyleSheet for the component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Add;
