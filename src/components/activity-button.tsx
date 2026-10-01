import { useState, Activity } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FadingPressable } from "@/components/fading-pressable";

// Side-by-side comparison: the same hide/show scenario with TouchableOpacity
// and with a Pressable that reproduces its opacity animation via Reanimated.
// Tap either "hide" button, then "Show again", and compare which of the four
// buttons comes back faded.
export function ActivityButton() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.hint}>
        1. Quickly tap one of the &quot;hide myself&quot; buttons (it hides all
        four buttons).{"\n"}
        2. Tap &quot;Show again&quot;.{"\n\n"}
        Expected: all buttons return at full opacity.{"\n"}
        Actual: the tapped TouchableOpacity comes back partially transparent
        and stays that way until it is pressed again.
      </Text>

      <Activity mode={visible ? "visible" : "hidden"}>
        <Text style={styles.section}>TouchableOpacity</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.label}>TouchableOpacity — I hide myself</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.label}>TouchableOpacity — control</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Pressable (Reanimated)</Text>
        <FadingPressable style={styles.button} onPress={() => setVisible(false)}>
          <Text style={styles.label}>Pressable — I hide myself</Text>
        </FadingPressable>

        <FadingPressable style={styles.button} onPress={() => {}}>
          <Text style={styles.label}>Pressable — control</Text>
        </FadingPressable>
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
    gap: 12,
    backgroundColor: "#fff",
  },
  hint: { color: "#333", marginBottom: 8 },
  section: { color: "#666", fontSize: 12, fontWeight: "600", marginTop: 8 },
  button: { backgroundColor: "#2563eb", padding: 16, borderRadius: 8 },
  show: {
    backgroundColor: "#555",
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  label: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
