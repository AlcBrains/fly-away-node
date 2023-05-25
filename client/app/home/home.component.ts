import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { map, mergeMap, Observable, shareReplay, Subscription, take, timer } from "rxjs";
import { BackendService } from "../core/services/backend/backend.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("arrivalsPaginator") arrivalsPaginator: MatPaginator;
  @ViewChild("departuresPaginator") departuresPaginator: MatPaginator;

  public PAGE_SIZE = 15;
  public arrivals: MatTableDataSource<any>;
  public departures: MatTableDataSource<any>;
  private airlineLogos: any[];
  private _time$: Observable<Date>;
  private subscription = new Subscription();
  public departuresDisplayedColumns: string[] = ["airline", "fnr", "destination", "sched", "schalter", "terminal", "gate", "status"];
  public arrivalsDisplayedColumns: string[] = ["airline", "fnr", "codeshare", "apname", "sched", "terminal", "status"];

  constructor(
    private backendService: BackendService,
    private _snackBar: MatSnackBar
  ) {
    this.arrivals = new MatTableDataSource<any>([]);
    this.departures = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.backendService
        .getAirlineLogos()
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res == null || res == "undefined") {
            this.airlineLogos = [""];
          }
          this.airlineLogos = JSON.parse(res);
        })
    );

    this.subscription.add(
      timer(0, 5 * 300000)
        .pipe(mergeMap(() => this.backendService.getDepartures()))
        .subscribe((data: any) => {
          if (data == null) {
            this._snackBar.open("Could not establish connection, attempting to reconnect");
            return;
          }
          this.departures.data = this.transformFlightInfo(JSON.parse(data));
        })
    );

    this.subscription.add(
      timer(0, 5 * 300000)
        .pipe(mergeMap(() => this.backendService.getArrivals()))
        .subscribe((data: any) => {
          if (data == null) {
            this._snackBar.open("Could not establish connection, attempting to reconnect");
            return;
          }
          this.arrivals.data = this.transformFlightInfo(JSON.parse(data));
        })
    );

    this._time$ = timer(0, 1000).pipe(
      map(() => new Date()),
      shareReplay(1)
    );
  }

  get time() {
    return this._time$;
  }

  ngAfterViewInit(): void {
    this.arrivals.paginator = this.arrivalsPaginator;
    this.departures.paginator = this.departuresPaginator;
    [this.arrivals.paginator, this.departures.paginator].forEach(
      (paginator) => {
        setInterval(() => this.changePage(paginator), 15000);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public changePage(paginator) {
    paginator.hasNextPage() ? paginator.nextPage() : paginator.firstPage();
  }

  private transformFlightInfo(rawFlightInfo) {
    // remove html directives
    rawFlightInfo.forEach((element: any) => {
      if (element.status.includes("&nbsp;")) {
        element.status = "";
      }
      // search airline's logo file in airlines list
      for (let airline of this.airlineLogos) {
        if (element.alname.toLowerCase().includes(airline.split(".")[0])) {
          element["image"] = "assets/icons/airlines/" + airline;
          break;
        }
      }
    });
    // pad array with empty data so as to have fixed length table
    while (rawFlightInfo.length % this.PAGE_SIZE != 0) {
      rawFlightInfo.push({ image: "assets/icons/airlines/blank.png" });
    }
    return rawFlightInfo;
  }
}
