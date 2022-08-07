import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { FieldNode, RIGHT_PANEL_TYPE, leftType } from "../../types";
import { MidItemsContainer, MidPanelWrapper } from "./style";

type DrawPanelProps = {
  data: Array<FieldNode>;
  setData: Function;
  setRightPanelType: Function;
  setRightRanelElementId: Function;
};

type DivComponentDropedProps = {
  item: FieldNode;
  setRightPanelType: Function;
  setRightRanelElementId: Function;
};
function TextComponentDroped({
  item,
  setRightPanelType,
  setRightRanelElementId,
}: DivComponentDropedProps) {
  const [, drag] = useDrag(() => ({
    type: leftType.DIV_DROPPED,
    item: { id: item.id },
  }));
  return (
    <div
      onClick={() => {
        console.log(`clicked: item ${item.id}`);
        setRightPanelType(RIGHT_PANEL_TYPE.TEXT);
        setRightRanelElementId(item.id);
      }}
      style={{
        color: item.color,
        fontSize: item.size,
        width: item.width,
        height: item.height,
        left: item.left,
        top: item.top,
        position: "absolute",
        backgroundColor: "#fdeff2",
        overflow: "hidden",
      }}
      ref={drag}
    >
      {item.data}
    </div>
  );
}

export default function MidPanel({
  data,
  setRightPanelType,
  setRightRanelElementId,
  setData,
}: DrawPanelProps) {
  const findCurrentElement = (id: string) => {
    return data.find((item: FieldNode) => item.id === id);
  };

  const changeElementData = (id: string, key: string, newData: any) => {
    const element = findCurrentElement(id);
    if (element) {
      element[key] = newData;
      setData([...data]);
    }
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    // accept: [COMPONENT_TYPE.TEXT, COMPONENT_TYPE.TEXT_DROPED], // drop接受的type
    accept: Object.values(leftType),
    drop: (_, monitor) => {
      const { x, y } = monitor.getSourceClientOffset()!; // 相对屏幕左上角的位置
      // 计算相对容器左上角的位置
      var [currentX, currentY] = [x - containerRef.current!.offsetLeft, y];
      if (window.scrollY < 50) {
        currentY = y - (50 - window.scrollY);
      }
      switch (monitor.getItemType()) {
        case leftType.DIV:
          setData([
            ...data,
            {
              id: `text-${Date.now()}`,
              type: "text",
              data: "2win19virus",
              color: "#000000",
              size: "12px",
              width: "10rem",
              height: "2rem",
              left: `${currentX}px`,
              top: `${currentY}px`,
            },
          ]);
          return;
        case leftType.DIV_DROPPED:
          console.log(monitor.getItem());
          changeElementData(
            (monitor.getItem() as { id: string }).id,
            "left",
            `${currentX}px`
          );
          changeElementData(
            (monitor.getItem() as { id: string }).id,
            "top",
            `${currentY}px`
          );
          return;
      }
    },
  }));

  const generateContent = () => {
    const ret = [];
    for (const item of data) {
      switch (item.type) {
        case "text":
          ret.push(
            <TextComponentDroped
              key={item.id}
              item={item}
              setRightPanelType={setRightPanelType}
              setRightRanelElementId={setRightRanelElementId}
            />
          );
          break;
      }
    }
    return ret;
  };

  return (
    <MidPanelWrapper ref={containerRef}>
      <MidItemsContainer ref={drop}>{generateContent()}</MidItemsContainer>
    </MidPanelWrapper>
  );
}
