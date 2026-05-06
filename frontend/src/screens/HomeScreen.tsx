import React, { useMemo, useState } from "react";
import { Alert, Button, FlatList, RefreshControl, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StackScreenProps } from "@react-navigation/stack";
import { deleteTasksApi, getTasksApi, Task } from "../api/tasks";
import { TaskItem } from "../components/TaskItem";
import { useAuth } from "../context";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = StackScreenProps<RootStackParamList, "Home">;

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: tasks = [], isLoading, refetch, isRefetching } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasksApi,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteTasksApi(ids),
    onSuccess: async () => {
      setSelectedIds([]);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const taskRows = useMemo(
    () =>
      tasks.map((task) => {
        const taskId = task._id || task.id || "";
        return { ...task, keyId: taskId };
      }),
    [tasks]
  );

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("Select at least one task");
      return;
    }

    try {
      await deleteMutation.mutateAsync(selectedIds);
    } catch (error: any) {
      Alert.alert("Delete failed", error?.response?.data?.message || "Try again");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>My Tasks</Text>

      <View style={{ gap: 8, marginBottom: 12 }}>
        <Button title="Create Task" onPress={() => navigation.navigate("CreateTask")} />
        <Button
          title={deleteMutation.isPending ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
        />
        <Button title="Logout" onPress={logout} />
      </View>

      {isLoading ? (
        <Text>Loading tasks...</Text>
      ) : taskRows.length === 0 ? (
        <Text>No tasks yet. Create your first task.</Text>
      ) : (
        <FlatList
          data={taskRows}
          keyExtractor={(item, index) => item.keyId || String(index)}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              selected={selectedIds.includes(item.keyId)}
              onToggle={() => toggleSelect(item.keyId)}
            />
          )}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      )}
    </View>
  );
};
