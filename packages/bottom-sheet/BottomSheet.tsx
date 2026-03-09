import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import KeyboardSpacer from "./KeyboardSpacer";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Max height as percentage string e.g. "60%", "85%" */
  maxHeight?: ViewStyle["maxHeight"];
  /** Content to render in the header right side, next to close button */
  headerRight?: React.ReactNode;
  /** Icon element to show before the title */
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
  /** Background color of the sheet. Default: #1f1f1f */
  backgroundColor?: string;
  /** Overlay color. Default: rgba(0,0,0,0.5) */
  overlayColor?: string;
  /** Border/divider color. Default: #272727 */
  borderColor?: string;
  /** Primary text color. Default: #ffffff */
  textColor?: string;
  /** Close button background. Default: #272727 */
  closeButtonBg?: string;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  maxHeight = "60%",
  headerRight,
  titleIcon,
  children,
  backgroundColor = "#1f1f1f",
  overlayColor = "rgba(0,0,0,0.5)",
  borderColor = "#272727",
  textColor = "#ffffff",
  closeButtonBg = "#272727",
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight,
            paddingTop: 8,
          }}
        >
          {/* Header */}
          {(title || headerRight) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 24,
                paddingVertical: 24,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                {titleIcon}
                {title && (
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: textColor,
                    }}
                  >
                    {title}
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {headerRight}
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: closeButtonBg,
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 18, color: textColor }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
            <KeyboardSpacer />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
