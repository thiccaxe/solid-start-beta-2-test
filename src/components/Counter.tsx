"use client";

import { onCleanup, useContext } from "solid-js";
import "./Counter.css";
import counterContext from "./counterContext";

type Location = {
  x: number;
  y: number;
};

export default function Counter() {
  let log: HTMLParagraphElement | undefined = undefined;
  let dialog: HTMLDialogElement | undefined = undefined;
  let timer: any | undefined = undefined;
  let startLocation: Location | undefined = undefined;
  let startId: number | undefined = undefined;
  let startTime: number | undefined = undefined;
  const [count, setCount] = useContext(counterContext);
  const cancelTouch = () => {
    clearTimeout(timer);
    startId = undefined;
    startLocation = undefined;
  };


  const touchStart = (e: TouchEvent) => {
    let touch = e.touches[0];
    startLocation = {
      x: touch.clientX, y: touch.clientY
    };
    startId = touch.identifier;
    startTime = performance.now();
    timer = setTimeout(() => {
      dialog?.showModal?.();
    }, 600);
  };


  const touchMove = (e: TouchEvent) => {
    let touch: Touch | undefined;
    for (let possibleTouch in e.touches) {
      if (startId == (possibleTouch as unknown as Touch).identifier) {
        touch = (possibleTouch as unknown as Touch);
      }
    }
    if (touch && startLocation) {
      if (
        (Math.abs(touch.clientX - startLocation.x) > 10) ||
        (Math.abs(touch.clientY - startLocation.y) > 10)
      ) {
        cancelTouch();      
      }
    }
  }

  const touchEnd = (e: TouchEvent) => {
    if (!startTime) {
      return;
    }
    const diff = performance.now() - startTime;
    if (diff < 550) {
      cancelTouch();
      return;
    }
    // time diff
  };

  const touchCancel = () => {
    cancelTouch();
  }
  onCleanup(() => {
    cancelTouch();
  })
  return (
    <div>
      <button onTouchStart={touchStart} onTouchMove={touchMove} onTouchCancel={touchCancel} onTouchEnd={touchEnd} class="increment" onClick={() => setCount(count() + 1)}>
        Clicks: {count()}
      </button>
      <dialog ref={dialog}>content</dialog>
      <p ref={log}></p>
    </div>
  );
}
