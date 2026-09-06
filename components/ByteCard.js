import { Text, View, Linking } from 'react-native';
import { PressableScale } from './Motion';
import styles from '../style/ByteCard.styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Bytes are stored with a sort key like "2026-09-05#0800". Show the day only,
// and fall back to nothing at all if the shape is not what we expect.
function formatDate(raw) {
  if (typeof raw !== 'string') return null;
  const parts = raw.split('#')[0].split('-');
  if (parts.length !== 3) return null;
  const month = MONTHS[Number(parts[1]) - 1];
  const day = Number(parts[2]);
  if (!month || !day) return null;
  return month + ' ' + day;
}

export default function ByteCard({ data }) {
  const date = formatDate(data.date);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.topicChip}>
          <Text style={styles.topicText}>{data.topic}</Text>
        </View>
        {date ? <Text style={styles.date}>{date}</Text> : null}
      </View>

      <View style={styles.rule} />

      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.body}>{data.body}</Text>

      <View style={styles.divider} />

      <PressableScale
        onPress={() => Linking.openURL(data.sourceURL)}
        style={({ pressed }) => [styles.source, pressed && styles.sourcePressed]}
        hitSlop={6}
      >
        <Text style={styles.sourceText}>Read the source</Text>
        <Text style={styles.sourceArrow}>→</Text>
      </PressableScale>
    </View>
  );
}
