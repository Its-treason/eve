import { Response } from 'express';

export class ResponseHelper {
  public static userErrorResponse(
    res: Response,
    msg: string,
    data: any = null,
  ): void {
    res.status(400);
    res.json({
      success: false,
      data,
      error: msg,
    });
  }

  public static userUnauthorizedResponse(
    res: Response,
    msg = 'Permission denied',
  ):void {
    res.status(401);
    res.json({
      success: false,
      data: null,
      error: msg,
    });
  }

  public static serverErrorResponse(
    res: Response,
    msg: string,
    data: any = null,
  ): void {
    res.status(500);
    res.json({
      success: false,
      data,
      error: msg,
    });
  }

  public static successResponse(res: Response, data: any = null): void {
    res.status(200);
    res.json({
      success: true,
      data,
      error: null,
    });
  }
}
