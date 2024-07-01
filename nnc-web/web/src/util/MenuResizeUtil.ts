/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

export class MenuResizeUtil {

  private static resizable: boolean = false;

  public static resize(
    targetResizeElementID: string,
    maxWidthTargetElementID: string = '',
    minWidthTargetElementID: string = '',
    isLeftMenu: boolean = true,
    offset: number = 10,
    onMouseMove?: (width: number) => void
   ): void {

    if (!targetResizeElementID) {
      return;
    }

    this.resizable = true;
    const iframe: NodeListOf<HTMLElement> | null = document.getElementsByTagName('iframe');
    if (iframe.length) {
      iframe[0].setAttribute('style', 'pointer-events:none');
    }

    document.addEventListener('mouseup', () => {
      this.resizable = false;
      document.removeEventListener('mousemove', mousemove);
      const iframeElement: NodeListOf<HTMLElement> | null = document.getElementsByTagName('iframe');
      if (iframeElement.length) {
        iframeElement[0].setAttribute('style', 'pointer-events:auto');
      }
    });

    const menuContainer: any = document.getElementById(targetResizeElementID);
    const maxWidthElement: any = document.getElementById(maxWidthTargetElementID);
    const minWidthElement: any = document.getElementById(minWidthTargetElementID);
    const maxWidth: number = maxWidthElement ?  maxWidthElement.getBoundingClientRect().left - offset : window.innerWidth - offset;
    const minWidth: number = minWidthElement ?  minWidthElement.getBoundingClientRect().left + offset : offset;

    const menuArea: HTMLElement | null = document.getElementById('account-menu-area');
    // rem指定
    const LEFT_MENU_MIN_WIDTH = 28;

    const mousemove: any = (e: any) => {
      if (this.resizable) {
        if (minWidth < e.clientX && e.clientX < maxWidth) {
          if (isLeftMenu) {
            const width: number = (e.clientX / 10);
            menuContainer.style.width = width + 'rem';
            if (menuArea) { // アカウントメニューが表示されている場合
              menuArea.style.left = width <= LEFT_MENU_MIN_WIDTH ? String(LEFT_MENU_MIN_WIDTH) + 'rem' : String(width) + 'rem';
            }
          } else {
            menuContainer.style.width = ((window.innerWidth - e.clientX) / 10) + 'rem';
          }
        }
      }
      if (onMouseMove) {
        onMouseMove(menuContainer.clientWidth);
      }
    };

    document.addEventListener('mousemove', mousemove);
  }
}
