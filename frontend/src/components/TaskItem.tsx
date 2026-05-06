import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Task } from "../api/tasks";

type TaskItemProps = {
  task: Task;
  selected: boolean;
  onToggle: () => void;
};

export const TaskItem = ({ task, selected, onToggle }: TaskItemProps) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 8,
          backgroundColor: selected ? "#d9ecff" : "#fff",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{task.title}</Text>
        <Text>{task.description || "No description"}</Text>
        <Text>Status: {task.status}</Text>
        <Text>{selected ? "Selected" : "Tap to select"}</Text>
      </View>
    </TouchableOpacity>
  );
};
