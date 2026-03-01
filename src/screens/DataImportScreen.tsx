import React, { useContext, useState, useRef } from "react";
import { NavigationContext } from "../App";

type PreviewFund = {
  id: string;
  code: string;
  name: string;
  amount: number;
  holdingReturn: number;
  group: string;
  isLoadingName: boolean;
};

export default function DataImportScreen() {
  const { goBack, funds, setFunds, refreshData } =
    useContext(NavigationContext);
  const [importSource, setImportSource] = useState("file");
  const [isImporting, setIsImporting] = useState(false);
  const [previewFunds, setPreviewFunds] = useState<PreviewFund[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFundName = async (code: string, id: string) => {
    try {
      const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`)}`;
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(/jsonpgz\((.*)\)/);

      if (match) {
        const data = JSON.parse(match[1]);
        setPreviewFunds((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((f) => f.id === id);
          if (index !== -1) {
            updated[index].name = data.name;
            updated[index].isLoadingName = false;
          }
          return updated;
        });
      } else {
        // Fallback to mobile API with proxy
        const fallbackUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&Fcodes=${code}`)}`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        if (
          fallbackData &&
          fallbackData.Datas &&
          fallbackData.Datas.length > 0
        ) {
          setPreviewFunds((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((f) => f.id === id);
            if (index !== -1) {
              updated[index].name = fallbackData.Datas[0].SHORTNAME;
              updated[index].isLoadingName = false;
            }
            return updated;
          });
        } else {
          setPreviewFunds((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((f) => f.id === id);
            if (index !== -1) {
              updated[index].name = "未知基金";
              updated[index].isLoadingName = false;
            }
            return updated;
          });
        }
      }
    } catch (e) {
      setPreviewFunds((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((f) => f.id === id);
        if (index !== -1) {
          updated[index].name = "查询失败";
          updated[index].isLoadingName = false;
        }
        return updated;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content);
          if (data.funds && Array.isArray(data.funds)) {
            setFunds(data.funds);
            alert("导入成功！");
            goBack();
          } else {
            alert("无效的 JSON 格式：缺少 funds 数组");
          }
          setIsImporting(false);
        } else if (file.name.endsWith(".csv")) {
          const lines = content.split("\n");
          const newPreviewFunds: PreviewFund[] = [];
          let startIndex = 0;

          let codeIdx = 0;
          let nameIdx = -1;
          let amountIdx = 1;
          let returnIdx = 2;
          let groupIdx = 3;
          let headerParts: string[] = [];

          if (lines.length > 0) {
            headerParts = lines[0]
              .split(",")
              .map((p) => p.trim().replace(/['"]/g, ""));
            const firstCol = headerParts[0];
            if (isNaN(parseInt(firstCol)) && firstCol !== "") {
              startIndex = 1;

              const cIdx = headerParts.findIndex((p) => p.includes("代码"));
              const nIdx = headerParts.findIndex((p) => p.includes("名称"));
              const aIdx = headerParts.findIndex((p) => p.includes("金额"));

              // Try to find exact match for '持有收益' first, otherwise fallback to any '收益'
              let rIdx = headerParts.findIndex((p) => p === "持有收益");
              let isReturnRate = false;

              if (rIdx === -1) {
                rIdx = headerParts.findIndex(
                  (p) => p.includes("收益") && !p.includes("率"),
                );
              }
              if (rIdx === -1) {
                rIdx = headerParts.findIndex((p) => p.includes("收益"));
                if (rIdx !== -1 && headerParts[rIdx].includes("率")) {
                  isReturnRate = true;
                }
              }

              const gIdx = headerParts.findIndex((p) => p.includes("分组"));

              if (cIdx !== -1) codeIdx = cIdx;
              if (nIdx !== -1) nameIdx = nIdx;
              if (aIdx !== -1) amountIdx = aIdx;
              if (rIdx !== -1) returnIdx = rIdx;
              if (gIdx !== -1) groupIdx = gIdx;
            }
          }

          for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line
              .split(",")
              .map((p) => p.trim().replace(/['"]/g, ""));
            if (parts.length > codeIdx) {
              let code = parts[codeIdx].replace(/[^0-9]/g, "");
              if (code) {
                code = code.padStart(6, "0");
                const amount = parseFloat(parts[amountIdx]) || 0;
                let holdingReturn = parseFloat(parts[returnIdx]) || 0;

                // If the column was a rate (e.g. 5.4 for 5.4%), calculate the absolute return amount
                if (
                  startIndex === 1 &&
                  headerParts &&
                  headerParts[returnIdx]?.includes("率")
                ) {
                  const rate = holdingReturn;
                  const principal = amount / (1 + rate / 100);
                  holdingReturn = amount - principal;
                }

                const group = parts[groupIdx] || "未分组";
                const name =
                  nameIdx !== -1 && parts[nameIdx]
                    ? parts[nameIdx]
                    : "加载中...";

                const id =
                  Date.now().toString() +
                  Math.random().toString(36).substring(7);
                newPreviewFunds.push({
                  id,
                  code,
                  name,
                  amount,
                  holdingReturn,
                  group,
                  isLoadingName: name === "加载中...",
                });
              }
            }
          }

          if (newPreviewFunds.length > 0) {
            setPreviewFunds(newPreviewFunds);
            setShowPreview(true);
            newPreviewFunds.forEach((pf) => {
              if (pf.isLoadingName) {
                fetchFundName(pf.code, pf.id);
              }
            });
          } else {
            alert("未找到有效的基金数据");
          }
          setIsImporting(false);
        } else {
          alert("不支持的文件格式，请上传 .json 或 .csv 文件");
          setIsImporting(false);
        }
      } catch (error) {
        alert("导入失败：" + (error as Error).message);
        setIsImporting(false);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    const newFunds = previewFunds.map((pf) => {
      const totalReturnRate =
        pf.amount > 0
          ? (pf.holdingReturn / (pf.amount - pf.holdingReturn)) * 100
          : 0;
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        code: pf.code,
        name:
          pf.name !== "加载中..." &&
          pf.name !== "未知基金" &&
          pf.name !== "查询失败"
            ? pf.name
            : pf.code,
        amount: pf.amount,
        returnRate: 0,
        totalReturnRate: isNaN(totalReturnRate) ? 0 : totalReturnRate,
        group: pf.group,
        isUp: pf.holdingReturn >= 0,
        isStarred: false,
        inPortfolio: true,
        nav: "1.0000",
        tag: null,
        color: "from-blue-500 to-blue-700",
        initials: pf.name.substring(0, 2).toUpperCase(),
      };
    });

    setFunds([...funds, ...newFunds]);
    alert(`成功导入 ${newFunds.length} 条数据！`);
    goBack();
    setTimeout(() => refreshData(), 100);
  };

  const handlePreviewChange = (
    id: string,
    field: keyof PreviewFund,
    value: string | number,
  ) => {
    setPreviewFunds((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, [field]: value };
          if (
            field === "code" &&
            typeof value === "string" &&
            value.length === 6
          ) {
            updated.isLoadingName = true;
            updated.name = "加载中...";
            fetchFundName(value, id);
          }
          return updated;
        }
        return f;
      }),
    );
  };

  const handleDeletePreview = (id: string) => {
    setPreviewFunds((prev) => prev.filter((f) => f.id !== id));
  };

  if (showPreview) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark h-full">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowPreview(false)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">
            确认导入数据
          </h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white dark:bg-[#192633] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">基金代码/名称</th>
                    <th className="px-4 py-3 font-medium">持有金额</th>
                    <th className="px-4 py-3 font-medium">持有收益</th>
                    <th className="px-4 py-3 font-medium">分组</th>
                    <th className="px-4 py-3 font-medium text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {previewFunds.map((fund) => (
                    <tr
                      key={fund.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={fund.code}
                            onChange={(e) =>
                              handlePreviewChange(
                                fund.id,
                                "code",
                                e.target.value,
                              )
                            }
                            className="w-24 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-mono text-slate-900 dark:text-white"
                            maxLength={6}
                          />
                          <span
                            className={`text-xs ${fund.isLoadingName ? "text-slate-400 animate-pulse" : "text-slate-500 dark:text-slate-400"}`}
                          >
                            {fund.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={fund.amount}
                          onChange={(e) =>
                            handlePreviewChange(
                              fund.id,
                              "amount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={fund.holdingReturn}
                          onChange={(e) =>
                            handlePreviewChange(
                              fund.id,
                              "holdingReturn",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={fund.group}
                          onChange={(e) =>
                            handlePreviewChange(
                              fund.id,
                              "group",
                              e.target.value,
                            )
                          }
                          className="w-24 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeletePreview(fund.id)}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {previewFunds.length === 0 && (
              <div className="p-8 text-center text-slate-500">暂无数据</div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#192633] border-t border-slate-100 dark:border-slate-800 pb-safe">
          <button
            onClick={handleConfirmImport}
            disabled={
              previewFunds.length === 0 ||
              previewFunds.some((f) => f.isLoadingName)
            }
            className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {previewFunds.some((f) => f.isLoadingName) ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                正在识别基金...
              </>
            ) : (
              `确认导入 ${previewFunds.length} 条数据`
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={goBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">
            arrow_back
          </span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">
          数据导入
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
            <span className="material-symbols-outlined text-3xl">upload</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            导入您的资产数据
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            您可以从其他平台或备份文件中导入您的基金持仓和交易记录，快速恢复数据。
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">
            选择导入来源
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImportSource("file")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${importSource === "file" ? "border-primary bg-primary/5 text-primary" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50"}`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">
                description
              </span>
              <span className="text-sm font-bold">本地文件</span>
              <span className="text-xs opacity-80 mt-1">CSV / JSON</span>
            </button>
            <button
              onClick={() => setImportSource("platform")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${importSource === "platform" ? "border-primary bg-primary/5 text-primary" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50"}`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">
                cloud_download
              </span>
              <span className="text-sm font-bold">第三方平台</span>
              <span className="text-xs opacity-80 mt-1">支付宝/天天基金</span>
            </button>
          </div>
        </div>

        {importSource === "file" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white dark:bg-[#192633] rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative overflow-hidden"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,.csv"
              className="hidden"
            />
            {isImporting ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  正在导入...
                </p>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                  upload_file
                </span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  点击选择文件
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  支持 .csv, .json 格式
                </p>
                <p className="text-[10px] text-slate-400 mt-2">
                  CSV格式建议: 代码, 金额, 持有收益, 分组
                </p>
              </>
            )}
          </div>
        )}

        {importSource === "platform" && (
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-slate-800/50 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              请选择要导入的平台，我们将引导您完成授权或账单导出流程。
            </p>
            <div className="space-y-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold">
                      支
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      支付宝账单导入指南
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">
                    expand_more
                  </span>
                </button>
                <div className="p-4 bg-white dark:bg-[#192633] text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    对接支付宝需要您执行以下操作：
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      打开支付宝 App，进入 <strong>我的</strong> {"->"}{" "}
                      <strong>账单</strong>。
                    </li>
                    <li>
                      点击右上角的 <strong>...</strong>，选择{" "}
                      <strong>开具交易流水证明</strong>。
                    </li>
                    <li>
                      选择 <strong>用于个人对账</strong>，选择时间范围。
                    </li>
                    <li>输入您的电子邮箱地址，点击发送。</li>
                    <li>
                      在电脑或手机上打开邮箱，下载并解压包含账单的 ZIP 文件。
                    </li>
                    <li>
                      回到本应用，切换到 <strong>本地文件</strong>{" "}
                      导入，选择解压出的 CSV 文件即可。
                    </li>
                  </ol>
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400">
                    注：目前支付宝不提供直接的 API
                    授权读取持仓，通过账单流水导入是最安全可靠的方式。
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center font-bold">
                    天
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    天天基金 (开发中)
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}

        {importSource === "platform" && (
          <button
            onClick={() => {
              alert("平台对接功能正在开发中，请优先使用本地文件导入");
            }}
            className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all mt-4"
          >
            了解更多
          </button>
        )}
      </div>
    </div>
  );
}
