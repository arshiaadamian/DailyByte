import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E1DED3',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    marginBottom: 28,
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 44,
    color: '#2F2E2C',
    textAlign: 'center',
    marginBottom: 18,
  },
  subheading: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 19,
    lineHeight: 28,
    color: '#5A5546',
    textAlign: 'center',
  },
  actions: {
    width: '80%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#816148',
    borderRadius: 999,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    backgroundColor: '#B7AE9B',
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 17,
    color: '#E1DED3',
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonPressed: {
    opacity: 0.6,
  },
  resendButtonText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 14,
    color: '#5A5546',
    paddingBottom: 20
  },
  scheduleTop: {
    width: '100%',
  },
  progressTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#D6D0C0',
    marginBottom: 32,
  },
  progressFill: {
    width: '55%',
    backgroundColor: '#2F2E2C',
    borderRadius: 999,
  },
  scheduleHeading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 28,
    color: '#2F2E2C',
    textAlign: 'left',
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 14,
    color: '#5A5546',
    marginBottom: 10,
  },
  byteSelector: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#D6D0C0',
    borderRadius: 999,
    padding: 4,
    marginBottom: 28,
  },
  byteOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byteOptionSelected: {
    backgroundColor: '#F5F1E7',
  },
  byteOptionText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#5A5546',
  },
  byteOptionTextSelected: {
    fontFamily: 'Newsreader_700Bold',
    color: '#2F2E2C',
  },
  deliveryRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#816148',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryRowLabel: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 16,
    color: '#F3EEE3',
  },
  deliveryRowValue: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#D9C9B3',
  },
  lockedRow: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B7AE9B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedRowText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 14,
    color: '#5A5546',
  },
  topicRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topicPill: {
    width: '48%',
    backgroundColor: '#D6D0C0',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicPillSelected: {
    backgroundColor: '#816148',
  },
  topicPillText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 14,
    color: '#5A5546',
    textAlign: 'center',
  },
  topicPillTextSelected: {
    fontFamily: 'Newsreader_700Bold',
    color: '#F3EEE3',
  },
});

export default styles;
