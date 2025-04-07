import React from "react";
import { TabState } from "../store/tabStore";
import { StoreApi } from "zustand";
import { GenericStateContext } from "hooks/useGenericState";
import { useTabServiceWithSelector } from "../store/tabServiceStore";
import {
  trackTabGenericStateSetPreviewMode,
  trackTabGenericStateSetSaved,
  trackTabGenericStateSetTitle,
} from "../analytics";

export const TabItem: React.FC<React.PropsWithChildren<{ store: StoreApi<TabState> }>> = React.memo((props) => {
  const [incrementVersion, activeTabId] = useTabServiceWithSelector((state) => [
    state.incrementVersion,
    state.activeTabId,
  ]);

  const sourceId = props.store.getState().source.getSourceId();
  const sourceType = props.store.getState().source.type;

  return (
    <GenericStateContext.Provider
      value={{
        activeTabId: activeTabId,
        tabId: props.store.getState().id,
        sourceId: props.store.getState().source.metadata.id,
        isNewTab: props.store.getState().source.getIsNewTab(),

        setTitle: (title: string) => {
          trackTabGenericStateSetTitle(sourceId, sourceType);
          props.store.getState().setTitle(title);
          incrementVersion();
        },

        setPreview: (preview: boolean) => {
          trackTabGenericStateSetPreviewMode(sourceId, sourceType, preview);
          props.store.getState().setPreview(preview);
          incrementVersion();
        },

        setSaved: (saved: boolean) => {
          trackTabGenericStateSetSaved(sourceId, sourceType, saved);
          props.store.getState().setSaved(saved);
          incrementVersion();
        },
      }}
    >
      {props.children}
    </GenericStateContext.Provider>
  );
});
