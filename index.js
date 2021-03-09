const express = require("express");
const { load } = require("cheerio");
const axios = require("axios");
const fs = require("fs");

async function start() {
  const baseUrl = "https://www.muztorg.ru/";
  const url = "https://www.muztorg.ru/category/akusticheskie-gitary?page=";
  let isFinish = false;
  let page = 20;
  const gitars = [];

  try {
    console.log("Start parse");

    while (true) {
      const res = await axios.get(`${url}${page}`);
      const $ = load(res.data);
      const pagination = $("li.next.disabled").html();
      const gitarsCard = $("section.product-thumbnail");

      gitarsCard.map(function () {
        const price = $(this).data("price");
        const title = $(this).find(".product-header > .title > a").text();
        const typeGitar = $(this).find(".product-catalog-grid > a").text();
        const productLink = `${baseUrl}${$(this)
          .find(".product-header > .title > a")
          .attr("href")}`;
        const imgUrl = $(this).find(".img-responsive").data("src");

        const gitar = {
          price,
          title,
          typeGitar,
          productLink,
          imgUrl,
        };
        gitars.push(gitar);
      });

      if (pagination) {
        isFinish = true;
      }
      if (isFinish) {
        fs.writeFile("gitars.json", JSON.stringify(gitars), "utf8", (err) => {
          console.log(err || "Write gitars in gitars.json file .");
        });
        break;
      }

      page++;
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log("The end");
  }
}

start();
