import React, { useState } from "react";
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getTaskStatus } from "../utils/taskUtils";
import { updateTaskApi } from "../api/tasks";

type Props = StackScreenProps<RootStackParamList, "EditTask">;

export const EditTaskScreen = ({ route, navigation }: Props) => {
  const { task } = route.params;
  const taskId = task._id || task.id || "";
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDateText, setDueDateText] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");
  const [isCompleted, setIsCompleted] = useState(task.status === "completed");

  const updateMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      status: "completed" | "inProgress" | "upComing";
      dueDate: string;
    }) => updateTaskApi(taskId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleUpdate = async () => {
    if (!taskId) {
      Alert.alert("Task ID missing");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Title is required");
      return;
    }

    const finalDateText = dueDateText.trim() || new Date().toISOString();
    const status = isCompleted ? "completed" : getTaskStatus(finalDateText);

    try {
      await updateMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: finalDateText,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Update failed", error?.response?.data?.message || "Try again");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Edit Task</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, minHeight: 80 }}
      />
      <TextInput
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDateText}
        onChangeText={setDueDateText}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
      />
      <TouchableOpacity onPress={() => setIsCompleted((prev) => !prev)}>
        <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}>
          <Text>{isCompleted ? "Completed: ON" : "Completed: OFF"}</Text>
        </View>
      </TouchableOpacity>
      <Button
        title={updateMutation.isPending ? "Updating..." : "Update Task"}
        onPress={handleUpdate}
        disabled={updateMutation.isPending}
      />
    </View>
  );
};
