import { useState, Activity } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ActivityButton() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.hint}>
        1. Quickly tap the top button (it hides both buttons).{"\n"}
        2. Tap &quot;Show again&quot;.{"\n\n"}
        Expected: both buttons return at full opacity.{"\n"}
        Actual: the tapped one comes back partially transparent and stays that
        way until it is pressed again.
      </Text>

      <Activity mode={visible ? "visible" : "hidden"}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.label}>Tap me — I hide myself</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.label}>Control — don&apos;t tap</Text>
        </TouchableOpacity>
      </Activity>

      <Pressable style={styles.show} onPress={() => setVisible(true)}>
        <Text style={styles.label}>Show again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#fff",
  },
  hint: { color: "#333", marginBottom: 8 },
  button: { backgroundColor: "#2563eb", padding: 16, borderRadius: 8 },
  show: {
    backgroundColor: "#555",
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  label: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
