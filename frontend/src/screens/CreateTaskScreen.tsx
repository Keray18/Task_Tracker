import React, { useState } from "react";
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskApi } from "../api/tasks";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getTaskStatus } from "../utils/taskUtils";

type Props = StackScreenProps<RootStackParamList, "CreateTask">;

export const CreateTaskScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpcomingEnabled, setIsUpcomingEnabled] = useState(false);
  const [dateText, setDateText] = useState("");

  const createMutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert("Title is required");
      return;
    }

    // Task status rule:
    // no date => inProgress
    // date > 7 days => upComing
    // otherwise => inProgress
    const dueDateText = dateText.trim() || new Date().toISOString();
    const status = isCompleted ? "completed" : isUpcomingEnabled ? getTaskStatus(dueDateText) : "inProgress";

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDateText,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Create failed", error?.response?.data?.message || "Try again");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Create Task</Text>
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

      <TouchableOpacity onPress={() => setIsUpcomingEnabled((prev) => !prev)}>
        <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}>
          <Text>{isUpcomingEnabled ? "Upcoming: ON" : "Upcoming: OFF"}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsCompleted((prev) => !prev)}>
        <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}>
          <Text>{isCompleted ? "Completed: ON" : "Completed: OFF"}</Text>
        </View>
      </TouchableOpacity>

      {isUpcomingEnabled ? (
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={dateText}
          onChangeText={setDateText}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
        />
      ) : null}

      <Button
        title={createMutation.isPending ? "Creating..." : "Create Task"}
        onPress={handleCreateTask}
        disabled={createMutation.isPending}
      />
    </View>
  );
};
