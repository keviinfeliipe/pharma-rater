import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker, Popup } from 'mapbox-gl';
import { SearchProductService } from '../../services/search-product.service'
import { PharmaProduct } from '../../models/pharma-product'
import { Drogueria } from '../../models/drogueria';

interface PharmaMarker {
  marker: Marker,
  distance: number,
}

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrls: ['./full-screen-page.component.scss']
})
export class FullScreenPageComponent implements AfterViewInit {

  constructor(
    public searchProductService: SearchProductService,
  ) { }
  @ViewChild('map') divMap?: ElementRef;
  public map?: Map;
  public km: number = 2000;
  public product:string = "";
  public currenLocation?: Marker;
  public products: PharmaProduct[] = [];
  public pharmaMarkers = new Set<PharmaMarker>();
  public droguerias?: Drogueria[] = [
    { name: 'Farmatodo', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIRFRUSEhIYGBIYEhgYGhwSGhkaGRgYGhweGR0cHRocIS4lHh4rHxgYJjgnKy8xNzU1GiQ7QDs0QC40NTEBDAwMEA8QHxISHj0rJSw1NDQxMTQ0NDQ0NDQ0PzQ0NDQ0NDQxNDQ0NDQ0MTQ0NDQ0NDE0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBBQgCBAP/xABKEAACAQIBBgcMCAQFBAMAAAABAgADBBEFBgcSITETNUFRYXGRFyIyUlNzgaGissHSFDRCYnJ0krFUgrPRFiMkM8IVRGOTNkPh/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAKREAAgEDAwMDBAMAAAAAAAAAAAECAxESITFRBBNBIkKBQ1JhcSMyM//aAAwDAQACEQMRAD8AuaIiAaPO7Kz2VpVuaaqzpq4B8dU4sF24EHllZd1m98hQ7H+eT7SZxbcdSe+s5+mijCMlqimpJp6Fh91m98hQ7KnzR3Wb3yFDsqfPK+iXdqHBXnLksHus3vkKHZU+eO6ze+QodlT55X0R2ocDOXJYPdZvfIUOyp88d1m98hQ7KnzyvojtQ4GcuSwe6ze+QodlT547rN75Ch2VPnlfRHahwM5clg91m98hQ7H+eO6ze+Qodj/PK+nmO1Dg7nLksPus3vkKHZU+aO6ze+QodlT55X0R2ocHM5clg91m98hQ7Knzx3Wb3yFDsqfPK+iO1DgZy5LB7rN75Ch2VPmjus3vkKHZU+eV9PMdqHAzlyWH3Wb3yFDsqfNHdZvfIUOyp88ryeo7UOBnLksHus3vkKHY/wA8d1m98hQ7H+eV9EdqHB3OXJYHdZvfIUOyp80tLNfKT3drRuHVVeomsQmOqDiRsxOPJOa50Po94utfNfEymtCMVoidOTb1JLERM5cIiIAiIgEU0mcW3HUn9RZz9OgdJnFtx1J/UWc/TX0+xRV3PURE0FYiIgCInmAJ+9laVK7inRps9Q7lQYk9PQOmfpknJ1S6rJb0hi7tgOYDlY8wAxM6DzYzboZOpcHSXFyO/dvCducnkHMBsEpqVFH9koQyKtyfosvqgDVXpUseQkuw6wuz1z7bjRHcgY07qkx5nRk9YLS4sImfvTLu3E5uy7mveWG24pEJjgHQ6yfqG70gTTYzqWrSV1KsAVIwIYYgg8hEpTSLmWLI/SbZT9GZsGXfwTndh907hzHZLada7syuULaog08zIhQSQACSSAANpJOwADnmkrAGOAG0k4ADeSdwA55Lsj6Oso3IDsi0VO41yQxH4FBPbhLBzDzISyRa9dQ12wx27RSB+yvJrc7ejdJ1hMs6+tolsafJUB0RV8PrlPW5uDbDt1vhNBlnR/lC1BfgxVQb2oEsQOcoQG7AZf2EyRK1Wn5JunE5VEzLe0j5krVV7y2TCuoLOijZUUbyB44Hb2SoAZqhNTV0USi4sxOh9HvF1p5r4mc8TofR7xdaea+JlXUbE6W5JYiJlLxERAEREAimkzi246k/qLOfp0DpM4tuOpP6izn6aun2KKu56iImkrEREATzPU8wC1dDGSlwr3jDvtbgVJ5AArMR14qPRLWkJ0TKBk9MN5q1SevXI/YCTaefUd5M0QVoozERIExPhyrk9LqjUoVBijoVPpGw9YOB9E+6YMA5YuKDU3em4wdHZG/EpIPrEl2i7JIub1XcYpQQ1CDuL+CnrxP8s+DSDbcFlG5XDYzq4/nRWPrJk50LWuFO5rYbWqIg6kUt+7zZOX8dzPFeqxZ8zETGaBERAPLDGc5Z65KFpe16SjBNfXQcyVO+A9BxHonRspDTAAL9MN5taeP66kuoP1WK6q0IJOh9HvF1p5r4mc8TofR7xdaea+JlnUbEKW5JYiJlLxERAEREAimkzi246k/qLOfp0DpM4tuOpP6izn6a+n2KKu56iYxjGaCkzExjGM4DM8zOMxOki3dDGUg1Kvak98lThFH3HAU9jL7QlnCcx5EyrVsqyXFI9+p2g7nU+ErdB/tOg828v0coURWonodT4SN4rD9jyiYq0GpXL6crqxuomJmUlgiJiAUZpepat/rePboewsvwEnOiClq2Abxq9Q9hC/8AGRLTOmF1Qbntj6nP95ONFyauTaHS1Q9tRpok/wCJFUV62TCIiZy0REwYAJnPOkHKS3V/WdTiiYUlI5QmIPtFpYmkbPQWqtaWzY3TrgzD/wCpT/zIJw5t55MaWmmhBr1MoqSvohOh9HvF1p5r4mc8TofR7xdaea+Jneo2FLcksREyl4iIgCIiARPSXxbcdSf1FlYZm5ivlJGrGuKdNahTAKWckAHnAG+WfpM4tuOpPfWarQ39Sf8AMv7qy6MnGm2uStpOWpiz0U2Kf7lStUPSwQdiAH1zbUdHuS0/7UN+N3P7tJXErc5PySxjwRv/AALkv+Dp+1/efPW0eZLb/tQv4HqL/wApKmcDaTgOmQPL+k60t2NOgpuKgOBKHVpg/jIOP8oPXOxyexx4rc/O90UWL/7dStTP4lcdjDH1yNZT0UXaYm3rU6g5nxRviD2iH0tXZOK29EDmJcntxE2eTNLikgXVqVHjUW1sP5GAPYTLUqsSDwZXOVciXVocLig6DxmU6h6nHentmcg5br2NUVqD4NuZT4Lrj4LDm6d4nQGSst2eUEJo1EqKR3ykd8BzMjDH1SOZw6NbO5xeh/p6v3BjTJ6aeOz0YSSrJ6TRx03vFm3zTzut8op3h1awHfU2I1h0jxl6R6cJJCZznljIV9kqoruGQq3eVaROqTyYMNxPimWFmfpKStq0b7BKm5ag2U3P3vFPTu6pXOl5jqicZ+GWZMTyrA7QcQeae5SWFOaal/z7U/8Ahf1MP7ydaN1wydbfgY9rtINpr/37XzNT3lk60c8XWvmz7zS6X+SKo/3ZKIia/KmVKNrTarXqBKa8rcp5gBtJ6BKS0+4mVnnxpFWlrW1i4artV6owKpyELyM/TuHTIznhpBrXmtSt9albbiQcKlQfeI8Ffuj080hAE006PmRTKp4Rl3LEsxJZiSSdpJO0knlOMRE1FR5nQ+j3i60818TOeJ0Po94utPNfEzN1GxZS3JLERMpeIiIAiIgEU0mcW3PUnvrNTob+pP8AmX91ZttJnFtx1J76zU6G/qT/AJl/dWW/T+SHv+CwIMTWZx3/ANFtq9cb6dF2H4gO99eEqSvoTKt0nZ4NVdrGg5FJDq1WXe7cqYj7A3HnPVtrrCZZixLE4kkkk8pO0meZ6EIKKsjJKWTuJnCZiTB6oVXpsKlN2RxuZCVYdRG2WHmzpRq09WnfLwibuEQAOvSy7mHVgeuVxM4SuUIy3EZNbHS9peWt/RLIyVqLDAjYwPQyncegyss89GzUw1ewBZNpaidrKOUoftD7p283NIFknK1xZuKttUKPy4bVYczKdjCXBmlpFoXmrSuMKNwdgxP+W5+6x3H7p9BMocZ03dbFqlGWjK8zUz5usnkI2NW3BwKOdqc+ox8E9B2dUuTN7OW1v01qFTFgO+Rtjr1r8RskT0gZiLcg3VooFwBi6DYKo5xzP+/rlQ0K1Si4emzJURthUlWUjeOcdUljGorrRjJxdmWFpqb/AFFsP/A/rb/8k60bPjk226FcdjsJSOW8u3F8ab3LhnRNQMAFLDHHFgNmO3kAn6/4kuxbrZpVKUE1tlPYX1mLnWbfhidwwHPjDptxUTimlJstnOvSJbWetToYVrgbMFPeIfvMN56B6pT+WctXF6/CXFQs32RuRBzKu4D1zXgTEshTjEhKbkJ6iJacEREA8zofR7xdaea+JnPE6H0e8XWnmviZm6jYspbkliImUvEREAREQCKaTOLbjqT31mp0N/Un/Mv7qzbaTOLbjqT31mp0OfUn/Mv7qy36fyQ9/wAFgSPZ+UWfJ92qjE8Ax2fd74+oSQz861MMpVhipBBHODsIla0dyT1RyyJmbbOnIb2Fw9BgdTHWptyMh8EjpG49IM089BO6uZGrOx6iIkjoieZ6gHmZInqlTZ2CIrM53KgLMeoDaZN8gaMry4we4It6Z5G76of5BsHpPokJTjHdhRb2MZnaQq9oVo3GtWt8Qo3tUTHZ3pO1xt8Hfzc03WkjNRaqf9RtUIJUPVTVKllIx19UgEMMe+G/sm+pWmR8hKGZl4bV2M5D12/Co8EbeQATeZr5wJlKi1ZKbKgqsgFTDFgApxIGIGOtuxO6ZXKzyii5LSzZzmJiSzSFmz/0+4xpr/pquLJhuQ/aT0Y4joPRIoJqjJSV0UNWdjMREmdEREAREQDzOh9HvF1p5r4mc8TofR7xdaea+JmbqNiyluSWIiZS8REQBERAIppM4tuOpPfWanQ39Sf8y/urNtpM4tuOpPfWanQ39Sf8y/urLfp/JD3/AAWDERKiZHs7M2KOUaXBv3tRcSjgYshP7qeUSjs4M2LuwYitTPB47KiAsjDn1vsnoOE6Rnh6YYEEAg7wdoPolkKjiQlBSOWMZlRicAMTzDaewTo2tmlk52LtZUCx3nUUY9eAn3WeSbahso0KdPzaKv7CXPqFwV9p8lBZKzNyjdYFLZ1U/arf5a+1tPoBk5yNomRcGvK5f7lEao9LnafQBLJvbunQRqlV1SmoxLMcAJVWdOlB31qVgNRdoNVx3x6VU+D1tt6JBTnN2R3GMdyZ3FxkvIqeDTpEjYqDWqv+7HrJwleZxaTbq4xS1XgKe7WxDVGHXhgno29Mg1es9Rmeo7O7HFmclmJ6SZ+ctjRS1erIym3se6js5LOxZicSWJJJ6Sdpl46JKerk9W8etUb2tX/jKMM6C0cUdTJ1t96mX/Uxb4yNfSIpf2PpzyyGt/a1KOA4QDWpk8lRRivoO49BnOrIVJVhgykgg7wQcCD6Z1RhKI0o5H+jXpqKMErrwgw3a+5x24H+aRoS1xJVY+SHRPM9TWVCIiAIiIB5nQ+j3i60818TOeJ0Po94utPNfEzN1GxZS3JLERMpeIiIAiIgEU0mcW3HUnvrNTob+pP+Zf3Vm20mcW3HUnvrNTob+pP+Zf3Vlv0/kh7/AILBiIlRMREQDE0ucucFHJ9E1qx27kUYaztzKPWTyCbomc8Z+Zda+u3bH/Kps1OmOTVU4FutiMerCWU4ZSITlij5c5M5LnKD61ZsEBxRF8BOrnb7x2zSz1E2pJKyM7d9xERJA8sZ0xm3a8Da21LxLemvpCjH1znHJtsatajTG96yJ+pgD6jOn0AAwG4DDsmXqHsi2kt2epAtLuTeFsuGAxahUVtniuQjejap9Ens12XrMXFtXon7dF19JU4evCZ4u0kyySurHMwmZ5TdPU9IzCIiAIiIB5nQ+j3i60818TOeJ0Po94utPNfEzN1GxZS3JLERMpeIiIAiIgEU0mcW3HUnvrNTob+pP+Zf3Vm20mcW3HUnvrNTob+pP+Zf3Vlv0/kh7/gsGIiVExERAPhyrVKUKzjetF2HWFJnMK7ds6mr0g6sh3MpB6iMJzHlKya2q1KDjBqdRkOPQcAeojA+maene5TV8HzxETUVCInmASvRpY8NlCjs72mHqn+UYL7TLL/ErDQzkkqla7YeGRTT8KYlj6WIH8ktATDWleRopqyMzBEzEqJnL+V6PB3Fen4leovoDkCfLNtngurfXYH8S/74/GamehHZGR7iIiTAiIgHmdD6PeLrTzXxM54nQ+j3i60818TM3UbFlLcksREyl4iIgCIiARTSZxbcdSe+s1Ohv6k/5l/dWbbSZxbc9Se+s1Ohv6k/5l/dWWr/AD+SHv8AgsGIiVExERAMGVppOzOa4/1lsmtVVcKiLvdRuYc7AcnKOqWXMYTsZOLujkoqSszlWep0Bl/MWxviXdClU73okKx6WGBVj1iRZ9ENPHvbx9X7yKT2giao14vcodORU5M3maubFfKNQIgK0ge/qEd6g5QOd+Ydss/JeiyypENVapWI5HIVP0rtPpMm9rapSVadNFRFGAVAAoHQBOTrr2nY035PzyXYU7aklCkuqlNQqjq5T0k4n0z7YiZS8TEzPDtgCTuAxgHNudj619dtz3NT1MR8Jqp+t9X4SpUqePUd/wBTFvjPynoJWRke4iIkwIiIB5nQ+j3i60818TOeJ0Po94utfNfEzP1GyLKW5JYiJkLxERAEREAiekzi246k99Zp9D9VVsnDMoP0l95A+yslGd2SXvbSrbIyqz6uBfHAYOG24beSVj3I7zy9D2/llsMXGzdiuV07pFx/Sqfjr+oR9Jp+OvaJTncju/L0Pb+WO5Hd+Xoe38sYQ+4ZS4Lj+k0/HXtEfSafjr2iU53I7vy9D2/ljuR3fl6Ht/LGEPuGUuC4/pNPx17RH0qn46/qEpzuR3fl6Ht/LHcju/L0Pb+WMIfcMpcFx/Sqfjr+oR9JTx1/UJTncju/L0Pb+WO5Hd+Xoe38sYQ5GUuC4/pKeOv6hH0lPHX9QlOdyO78vQ9v5Y7kd35eh7fyxhDkZS4Lj+k0/HXtEfSafjr2iU53I7vy9D2/ljuR3fl6Ht/LGEPuGUuC4/pKeOvaJp87MqpQs7ioHXWFJguBGOs3eL62ErTuR3fl6Ht/LA0R3fl6Ht/LOqEE9xlJ+CvVGGyJYfckvP4ih7fyx3JLz+Ioe38s0d2HJVhLgryJYfckvP4ih7fyx3JLz+Ioe38sd2HIwlwV5EsPuSXn8RQ9v5Y7kl5/EUPb+WO7DkYS4K8M6H0e8XWvmviZXfckvP4ih7fyy0c2MmvaWtG3dlZ6aapKY4E4k7MdvLKa04yWjJ04tPU3EREzlwiIgCIiAfhcV0pqXqMFRRizMQABzknYBPg/xHY/xlv/AO6n80+LP7i68/LtKazQzTOUuFwuFpcHqeEutra+tu74btX1yyEE1dshKTTsi9KGXbSowRLugzscFVKqMxPMADiTPtrV0RSzuqqN5chQPSdkrHIejk2lendte02Wi+uwWmRiADjt1zh2SNV613nDdsiNq0hiyqxISnTBwDMBvc4jp2nkEdtN6PQ5k0tUXKmX7JiFW7oFiQABVQkk7AANbacZ+l3li1otqVbmkj4A6tSoqtgdxwY44ShauRzY5So2rOHKXVt3wXVB1mR9gJOHhYTbaV01spBfGoURj1s4+Ml2ldK5zN22LmtMrW1Y4Urik55qdRWPYDP1u7ylRXXrVEppjhrVGCridwxJwxlIZ05h1smUxdLcB1V1UlFNN1JOCkd8eXAbDyzZZZyvUvMiU6lY61RbtaZblbVxwJ6cCMekTnbWjT0O5vW6LUo5ds3IVLqgzHcFqoSfQDP2u8pUKOHDVqdPHdwjqmPVrEYygEzUqPYHKKOpRWYMmBDKFbV1g2O3bhswE/fIGQrnLNWoz1sODpprPUBc4AaqqBiORT2Y8sl2o73Odx8F62mV7as2pSuKTvhjhTqIxw58FOOE+xnAGJOAHKZSeiFcL5xzW7jsZJ++fuXLm/vP+m2pPBq/B6qnVFSph3xY+Ku3YdmwnmkHS9VkzufpuWo+cNkpIa8oAjeDVpjD1xVy7ZodVrqgpwDYNUQHAjEHAncRtxlD53Zqvkw0UqVFdqiO3eKQE1SowxJ77wt+A3SeVNHK360bk3JQva0BqimGw1aajfrDmnXTikncKUn4J3/iOx/jLf8A91P5p9FnlKhX1uBrU6mrhrcE6vq47sdUnDHA9k5/yTm6Li/NiamqBUqJrhQT/l623Vx5dXnkjy3bvm+j0La4LVrpUJbVCGmlMsMV2nvmLkdGBnXSV7J6hTe7Rblzla2pHVqXFJG5nqIp7CcZ9VKqrAMrBlO4qQQfSJQ2Q8wb2/p/ScVRXGKmsxLVPvbATgec755yFli6yJdcDW1lphwtWmTimqftpyY4HEEb9x6OOkvD1Gb8ou+6yxa0W1KtzSR8AdWpURWwO44E4z9bTKFGsMaVVHA8m6v7pMpPSgA+UsAdj0aAB6GxAPrnnL2ad5kYrdUq2sgcDhKQKFW5A6knvThhvI5DCpKy11Yzd3oXxPlu8o0KOHDVqdPHdwjqmP6iJBbjP4jJa3agC6d+BC/ZFUb2w5tXvsOkCQHIea99lhnr6+K6xDVa7E6zbyqjaThiN2AGPonI0/MnY658F+W11TqjWpurrzoQw7RP2nPVWjf5BuAcdVjtGocadZARiCOXm2jEYy9si5RS6oUrhPBqIGwPITvU9RxHonJwx1Wx2MrmxiIkCQiIgCIiAR3P7i68/LtKVzXzQrZU4Tgnprwepjwutt19bDDVU+LL2zlyc11a17dGCvUplQWxwBPKcJoNH2adXJnD8LUR+E1MNTW2autjjj+IS2E8Yu25XKN5I0uQM0K+S7fKD1XptwlqQvBa2I1FcnHWUeMJX+aeU762Z2saZd2RQ+FMvgoOI2DdtxnQGV7U1qFakpAZ6ToCdwLKQMe2RHMDMutk2pWepVRw6KoCa2IKsTiceudjUWLb3OOOqsVgbu4r5Ro1LtStdrq31wVKYYMgHend3oE3GlgkZSBHhChSI69Z8Nkl2W8w7i4yh9OWrTFPhaL6rBtbCnqYjdhidQ9sznhmJcX94t1TrU1QJTXBw2t3jEncOmS7kbp/g5i7NEAzqy7lS4RKd8jpT1tYKaZphmHOTvIx3Td5TpUkyDQ4Jiwa5DOSMDrktrjDoIw9Ali57ZBbKFsaCMqvwiMpcHAap27tu0Ej0yOPmHXOTVsOGp8ILk1dbBtXA4nDdjjthTi0vGocXd/o12Rv/jtf8Nb35jQv4N71Uv2qSSWGaVWnkupk41ENRxUAYa2qNZtYY8s85g5o1smi4FWoj8LqYamts1QwOOP4hIucbP8AZ1RehB9EnGD+Yqe+s0TXVxRyjVqWqlq63VbUAUvjizA96N+wmWTmTmNXyfcvcVKqOrU2XBNbHFmB5R0T88j5h3FDKH05qtMpw1V9Ua2tg+tgN2GPfCSzjk3+DmLskVxnblS+uWptfUyjKjhMaZp4gka2w79oEvrNz6pbflqXuLIxpAzNrZTeg9KoiCmjg8IG2lipGGH4ZLclWxo0KNJiCyUkQkbiVUKSOyQnJOKsTjFpspzNTjxvzFz/AM59Gme1YXNGofAe3Kg/eViSOx1kkyNmLXt8oG+aqhQ1ar6q62thU1sBuw+0JK848hUcoUTQrA4Y4qy+EjDcy/25ROuaUk/wRxbTR8eaOX7a4taTI6KUpKjqWAKMqgEEHk2bDzSp9JOU6d7e/wCnwYKi0gy7Q74nwTyjFtX0T773RTfqxFN6LpyMzMh9K6pw7TJRmbo4W0dbi6dalVTiioDqI3jYnwm5tgAnVjF5JnPU9GiE59UTTvqFNj3yW9opPSowP7SdaUc4bdbV7VXV61QqNVSDqKDrFmw3bsB1z8c9MwLjKFy1xTq00Q0kXBw2OK447h0z4cjaJQrBruuGpg46lFSut0FycQOoY9M7lGybews7tJbkRusl1FyVQuCDqG8dv5WUU1bqLIcOvplhaKsuW7Wi2xdUrU2fFWIBZWYsGGO8bcPRJldZLo1aJtnQcCU1NUbAFG7DDdhswPRKpytoouVc/RaqPTJ2CqSjKOY4AhuvZOZRmrS0O4uLuj9NL+WaFZqFvSdWemzs7IQQusAAuI5eUjoEnWjq2elk62VxgSjPgd+Duzr6mEh+bWitldal9UUopB4OkSQxHIzEDvegDbzy1UUAAAYAbBhySM5RxUUdine7P0iIlRYIiIAiIgGIiIBmYmYgGJmIgGImYgGJmIgGJmIgGIiIBmYmYgCIiAJiZiAYiZiAYmYiAIiIAiIgH//Z' },
    { name: 'Cruz Verde', image: 'https://santaanacentrocomercial.com/wp-content/uploads/2021/08/LOGO-CRUZ-VERDE-100.jpg' },
    { name: 'Colsubsidio', image: 'https://rmkcdn.successfactors.com/e83d8397/d5bcc205-70d6-4cf8-8865-e.png' },
  ]


  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';
    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.2119127687266, 4.577967751500744],
      zoom: -2,
    });
    this.currentLocation();
    //this.searchProducts();
  }

  addMarker(longitude: string, latitude: string, color: string, text: string) {
    if (!this.map) return;
    const coords = new LngLat(Number(longitude), Number(latitude));
    const popup = new Popup({ offset: 25 }
      ).setText(
      text
      );
    const marker = new Marker({
        color: color,
        draggable: false,
      })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(this.map);
    const currentPosition = this.readFromLocalStorage();
    let distance = currentPosition.distanceTo(coords);
    this.pharmaMarkers.add(
      { marker, distance }
    );
  }

  removeMarker() {
    for (let value of this.pharmaMarkers) {
      if (value.distance >= this.km) {
        value.marker.remove();
        this.pharmaMarkers.delete(value);
      }
    }
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage(key: string, marker: Marker) {
    const lnglat = marker.getLngLat().toArray();
    localStorage.setItem(key, JSON.stringify(lnglat));
  }

  readFromLocalStorage(): LngLat {
    const currentLocationString = localStorage.getItem('initialPosition') ?? '[]';
    const initialPosition: number[] = JSON.parse(currentLocationString);
    return new LngLat(initialPosition[0], initialPosition[1]);
  }

  currentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!this.map) return;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords = new LngLat(longitude, latitude);
        this.currenLocation = new Marker({
          draggable: false,
        })
          .setLngLat(coords)
          .addTo(this.map);
        this.flyTo(this.currenLocation);
        this.saveToLocalStorage("initialPosition", this.currenLocation);

      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("El usuario denegó la solicitud de geolocalización.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("La información de geolocalización no está disponible.");
            break;
          case error.TIMEOUT:
            console.log("Se agotó el tiempo para obtener la geolocalización.");
            break;
          default:
            console.log("Ocurrió un error desconocido: " + error.message);
        }
      });
    } else {
      console.log("La geolocalización no es compatible en este navegador.");
    }
  }

  searchProducts(product:string) {
    let position = this.currenLocation?.getLngLat();
    let latitude = String(position?.lat);
    let longitude = String(position?.lng);
    this.searchProductService.findAll(product, longitude, latitude, String(this.km)).subscribe((data) => {
      this.products = data;
      this.products.forEach(({ longitude, latitude, address }) => {
        this.addMarker(longitude, latitude, 'red', address);
      })
    })
  }

  zoomIn() {

  }

  zoomOut() {

  }

  zoomChanged(value: string) {
    this.km = Number(value);
  }
}
