import { Injectable } from '@angular/core';
import { IntentMessage, IpcMessage, Content, UpdateContentListParam, UpdateCategoryListParam } from '../data';
import { MessagingService } from './messaging.service';

/**
 * BFFへメッセージを送信するサービス
 */
@Injectable()
export class DeliveryService {
  private LOGEVENT: string = "[Foxpict][DeliveryService]";

  constructor(
    private messaging: MessagingService
  ) { }

  /**
  * 状態遷移の初期化用メッセージ呼び出し.
  *
  * クライアントが利用可能であることを、BFFに通知するためのイベントです
  */
  public transTopScreen() {
    console.info(this.LOGEVENT, "[transTopScreen]");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_TOPSCREEN";
    intentMessage.Parameter = "";

    this.send(intentMessage);
  }

  /**
   * 戻る遷移コマンドを発行します
   */
  public backScreen() {
    console.info(this.LOGEVENT, "[backScreen]");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_BACKSCREEN";
    intentMessage.Parameter = "";

    this.send(intentMessage);
  }


  /**
   * デバッグ用遷移メッセージを発行します
   */
  public transRootBack() {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    //intentMessage.MessageName = "TRNS_DEBUG_BACK";
    intentMessage.MessageName = "ACT_DEBUGCOMMAND";
    intentMessage.Parameter = "RESET_TRANSITION";

    this.send(intentMessage);
  }

  /**
   * カテゴリ一覧画面を表示する遷移イベントを発行します
   */
  public showFinder() {
    console.info("[Foxpict][Delivery][showFinder] カテゴリ一覧画面への遷移メッセージ送信");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_FinderScreen";
    intentMessage.Parameter = "";

    this.send(intentMessage);
  }

  /**
   * プレビュー画面を表示する遷移イベントを発行します
   *
   * @param index 表示したいアイテムのナビゲーションリスト内での位置
   */
  public showScreenPreview(index: number) {
    console.info("[Foxpict][Delivery][showScreenPreview] プレビュー画面への遷移メッセージ送信", "コンテントリストの選択", index);
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_ContentListPreview";
    intentMessage.Parameter = index.toString();

    this.send(intentMessage);
  }


  /**
   * カテゴリ一覧の更新を行います
   *
   * @param categoryId カテゴリのID
   */
  public updateCategoryTree(categoryId: number) {
    console.info("[Foxpict][Delivery][updateCategoryTree] ");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_CATEGORYTREE";
    intentMessage.Parameter = categoryId.toString();

    this.send(intentMessage);
  }

  /**
   * ラベル一覧の更新を行います
   *
   * @param labelId カテゴリツリーを取得したい親カテゴリのID
   */
  public updateLabelTree(labelId: number) {
    console.info("[Foxpict][Delivery][updateLabelTree] ");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_LABELTREE";
    intentMessage.Parameter = labelId.toString();

    this.send(intentMessage);
  }

  /**
   * コンテントの更新
   *
   * @param content
   */
  public updateContent(content: Content) {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_STORE_CONTENTPROP";
    intentMessage.Parameter = JSON.stringify({
      Hint: "Invalidate",
      Content: content
    });

    this.send(intentMessage);
  }

  /**
   * コンテント一覧を更新します
   *
   * @param param
   */
  public updateContentList(param: UpdateContentListParam) {
    // ルール: 任意のカテゴリに紐付けられているコンテント一覧を作成します。
    // TODO: 他のルールも追加する
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_CONTENTLIST";
    intentMessage.Parameter = JSON.stringify(param);

    this.send(intentMessage);
  }

  /**
   * カテゴリ一覧を更新します
   *
   * @param param
   */
  public updateCategoryList(param: UpdateCategoryListParam) {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_CATEGORYLIST";
    intentMessage.Parameter = JSON.stringify(param);

    this.send(intentMessage);
  }

  /**
   * プレビュー画面の表示内容を更新する
   *
   * @param position コンテント一覧の位置
   */
  public invalidatePreviewContentList(position: number) {
    // プレビューコンテント更新要求メッセージ(ACT_REQINVALIDATE_PREVIEW)の送信用メソッド
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_PREVIEW";
    intentMessage.Parameter = JSON.stringify({
      Operation: "NavigationPosition",
      Position: position
    });
    this.send(intentMessage);
  }

  /**
   * プレビュー画面の表示内容を更新する
   *
   * コンテント一覧の現在位置から次のコンテント情報を表示する。
   */
  public invalidatePreviewContentListNext() {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_PREVIEW";
    intentMessage.Parameter = JSON.stringify({
      Operation: "NavigationNext"
    });
    this.send(intentMessage);
  }

  /**
   * プレビュー画面の表示内容を更新する
   *
   * コンテント一覧の現在位置から前のコンテント情報を表示する。
   */
  public invalidatePreviewContentListPrev() {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_REQINVALIDATE_PREVIEW";
    intentMessage.Parameter = JSON.stringify({
      Operation: "NavigationPrev"
    });
    this.send(intentMessage);
  }


  /**
   * プレビュー画面の表示内容を更新する
   *
   * コンテントIDに指定したコンテントで更新する。
   *
   * @param contentId コンテントID
   */
  public invalidatePreviewContentId(contentId: number) {
    // TODO:
  }

  public executeDebugCommand(command: string) {
    console.info("[Foxpict][Delivery][executeDebugCommand] デバッグコマンドメッセージ送信", command);
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_DEBUGCOMMAND";
    intentMessage.Parameter = command;

    this.send(intentMessage);
  }

  /**
   * IPCメッセージを送信します。
   *
   * @param message 送信するIPCメッセージ
   */
  private send(message: IntentMessage) {
    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(message);
    this.messaging.sendIpc(ipcMessage);
  }
}
