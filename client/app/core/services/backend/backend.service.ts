import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as fs from "fs";
import { catchError, Observable, of, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BackendService {
  fs: typeof fs;

  constructor(private http: HttpClient) {}

  public getArrivals(): Observable<string> {
    return this.http.get("api/arrivals", { responseType: "text" }).pipe(
      catchError((error: any) => {
        console.log(error);
        return of("{}");
      })
    );
  }

  public getDepartures(): Observable<string> {
    return this.http.get("api/departures", { responseType: "text" }).pipe(
      catchError((error: any) => {
        console.log(error);
        return of("{}");
      })
    );
  }

  public getAirlineLogos(): Observable<string> {
    return this.http.get("api/logos", { responseType: "text" }).pipe(
      catchError((error: any) => {
        console.log(error);
        return of("{}");
      })
    );
  }
}
