namespace FCCharts
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;

    class Program
    {
        static void Main(string[] args)
        {
            var symbol = "cl";
            var IEXTrading_API_PATH = "https://api.iextrading.com/1.0/stock/{0}/chart/1y";

            IEXTrading_API_PATH = string.Format(IEXTrading_API_PATH, symbol);

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                //For IP-API
                client.BaseAddress = new Uri(IEXTrading_API_PATH);
                HttpResponseMessage response = client.GetAsync(IEXTrading_API_PATH).GetAwaiter().GetResult();
                if (response.IsSuccessStatusCode)
                {
                    var historicalDataList = response.Content.ReadAsAsync<List<HistoricalDataResponse>>().GetAwaiter().GetResult();
                    foreach (var historicalData in historicalDataList)
                    {
                        if (historicalData != null)
                        {
                            Console.WriteLine("Date: " + historicalData.Date);
                            Console.WriteLine("Open: " + historicalData.Open);
                            Console.WriteLine("Close: " + historicalData.Close);
                            Console.WriteLine("Low: " + historicalData.Low);
                            Console.WriteLine("High: " + historicalData.High);
                            Console.WriteLine("Change: " + historicalData.Change);
                            Console.WriteLine("Change Percentage: " + historicalData.ChangePercent);
                            Console.WriteLine(Environment.NewLine);
                        }
                    }
                }
            }
            Console.ReadLine();
        }
    }
}
